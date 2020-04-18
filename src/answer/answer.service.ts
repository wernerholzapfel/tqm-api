/* eslint-disable @typescript-eslint/ban-ts-ignore */
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Question} from '../question/question.entity';
import {Connection, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {FirebaseService} from '../firebase/firebase/firebase.service';
import {Answer} from './answer.entity';
import {CreateAnswerDto} from './create-answer.dto';
import {Quiz} from '../quiz/quiz.entity';

@Injectable()
export class AnswerService {

    constructor(private readonly connection: Connection,
                @InjectRepository(Answer)
                private readonly answerRepository: Repository<Answer>,
                private firebaseService: FirebaseService
    ) {
    }

    async create(answer: CreateAnswerDto, particpantId: string): Promise<Answer> {
        return await this.answerRepository.save({
            ...answer,
            quiz: {id: answer.quizId},
            participant: {id: particpantId}
        })
            .then(async response => {
                this.firebaseService.updateActiveQuestion(response.quizId, response.question.id);
                return response;
            })
            .catch((err) => {
                throw new HttpException({
                    message: err.message,
                    statusCode: HttpStatus.BAD_REQUEST,
                }, HttpStatus.BAD_REQUEST);
            });
    }

    async getStand(quizId: string): Promise<any> {
        // todo remove this
        this.firebaseService.updateTable(quizId);

        const questions = await this.connection.getRepository(Question)
            .createQueryBuilder('question')
            .leftJoin('question.quiz', 'quiz')
            .leftJoinAndSelect('question.owner', 'owner')
            .leftJoinAndSelect('question.answers', 'answers')
            .leftJoinAndSelect('answers.participant', 'participant')
            .where('quiz.id = :quizId', {quizId})
            .getMany();


        const quiz = await this.connection.getRepository(Quiz)
            .createQueryBuilder('quiz')
            .leftJoinAndSelect('quiz.participants', 'participants')
            .where('quiz.id = :quizId', {quizId})
            .getOne();


        const questionsWithScore = await questions.map(question => {
            return {
                ...question,
                answers: question.answers.map(answer => {
                    return {
                        ...answer,
                        score: this.firebaseService.determineScore(answer, question, quiz)
                    }
                })
            }
        });

        const participantsWithTheirAnswers = quiz.participants.map(participant => {
            return {
                ...participant,
                answers: this.firebaseService.getAnswers(participant, questionsWithScore)
            }
        });

        const table = participantsWithTheirAnswers.map(participant => {
            return {
                ...participant,
                totaalScore: this.firebaseService.getTotaalScore(participant.answers)
            }
        });


        return table;
    }


}
