/* eslint-disable @typescript-eslint/ban-ts-ignore */
import {Injectable, Logger} from '@nestjs/common';
import {Participant} from '../../participant/participant.entity';
import {Connection, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import * as admin from 'firebase-admin';
import {Quiz} from '../../quiz/quiz.entity';
import {Question} from '../../question/question.entity';
import {Answer} from '../../answer/answer.entity';

@Injectable()
export class FirebaseService {

    private readonly logger = new Logger('FirebaseService', true);

    // todo update active question
    // todo update stand

    constructor(private readonly connection: Connection,
                @InjectRepository(Participant)
                private readonly participantRepository: Repository<Participant>) {
    }

    async updateQuizMetaData(quizId: string) {

        const db = admin.database();
        const docRef = db.ref(`${quizId}/metadata`);

        const quizParticipants = await this.connection
            .getRepository(Quiz)
            .createQueryBuilder('quiz')
            .leftJoinAndSelect('quiz.participants', 'participants')
            .loadRelationCountAndMap('participants.questions', 'participants.questions')
            .where('quiz.id = :quizId', {quizId})
            .getOne();

        docRef.set(quizParticipants);

        // todo return something for error handling
    }

    async setNewQuestion(quizId: string) {
        const question = await this.connection.getRepository(Question)
            .createQueryBuilder('question')
            .leftJoin('question.quiz', 'quiz')
            .leftJoinAndSelect('question.answers', 'answers')
            .leftJoinAndSelect('answers.participant', 'participant')
            .leftJoinAndSelect('question.owner', 'owner')
            .loadRelationCountAndMap('question.answers', 'question.answers')
            .where('question.isAnswered = :isAnswered', {isAnswered: false})
            .andWhere('quiz.id = :quizId', {quizId})
            .getOne();

        const db = admin.database();
        const questionRef = db.ref(`${quizId}/activeQuestion`);
        questionRef.set(question ? {...question, isFinished: false} : {isFinished: true})
    }

    async updateActiveQuestion(quizId: string, questionId: string) {
        const question = await this.connection.getRepository(Question)
            .createQueryBuilder('question')
            .leftJoin('question.quiz', 'quiz')
            .leftJoinAndSelect('question.answers', 'answers')
            .leftJoinAndSelect('answers.participant', 'participant')
            .leftJoinAndSelect('question.owner', 'owner')
            .loadRelationCountAndMap('question.answers', 'question.answers')
            .where('question.id = :questionId', {questionId})
            .getOne();

        const db = admin.database();
        const questionRef = db.ref(`${quizId}/activeQuestion`);
        questionRef.set(question)
    }

    async updateTable(quizId: string) {
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
                        score: this.determineScore(answer, question, quiz)
                    }
                })
            }
        });

        const participantsWithTheirAnswers = quiz.participants.map(participant => {
            return {
                ...participant,
                answers: this.getAnswers(participant, questionsWithScore)
            }
        });

        const table = participantsWithTheirAnswers.map(participant => {
            return {
                ...participant,
                totaalScore: this.getTotaalScore(participant.answers)
            }
        });

        const db = admin.database();
        const tableRef = db.ref(`${quizId}/table`);
        tableRef.set(table);

        return table
    }

    getAnswers(participant, questions: Question[]) {
        const answers = [];
        questions.forEach(q => {
            answers.push(q.answers.find(a => a.participant.id === participant.id))
        });
        return answers
    }

    getTotaalScore(answers: Answer[]) {
        return answers.reduce((a, b) => {
            // @ts-ignore
            return a + b.score
        }, 0);
    }

    determineScore(answer: Answer, question: Question, quiz: Quiz) {
        if (question.owner.id === answer.participant.id) {
            return this.determineOwnerScore(question, quiz)
        } else {
            const ownerAnswer = question.answers.find(answer => {
                return question.owner.id === answer.participant.id
            }).answer;
            if (ownerAnswer === answer.answer) {
                return 3
            } else {
                return 0;
            }
        }
    }

    determineOwnerScore(question: Question, quiz: Quiz): number {
        const aantalDeelnemers: number = quiz.participants.length;
        const scoreVerloop = 3;
        const owner = question.answers.find(a => a.participant.id === question.owner.id);

        if (owner) {
            const aantalCorrectBeantwoord = question.answers.filter(a => a.answer === owner.answer).length;

            const maxScore = Math.ceil((aantalDeelnemers - 1) * 3 / 2);

            console.log(maxScore);

            const mean = Math.ceil(aantalDeelnemers / 2);

            if (aantalCorrectBeantwoord === mean) {
                return maxScore
            } else {
                if (aantalCorrectBeantwoord < mean) {
                    const factor = 1 / 2 * (mean - aantalCorrectBeantwoord) * (mean - aantalCorrectBeantwoord + 1) * scoreVerloop;
                    console.log(factor);
                    return maxScore - factor < 0 ? 0 : Math.floor(maxScore - factor);
                } else {
                    const factor = 1 / 2 * (aantalCorrectBeantwoord - mean) * (aantalCorrectBeantwoord - mean + 1) * scoreVerloop;
                    console.log(factor);
                    return maxScore - ((aantalCorrectBeantwoord - mean) * scoreVerloop) < 0 ? 0 : Math.floor(maxScore - ((aantalCorrectBeantwoord - mean) * scoreVerloop))
                }
            }
        }
    }
}

