import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Connection, getManager, Repository} from 'typeorm';
import {Quiz} from './quiz.entity';
import * as admin from 'firebase-admin';
import {CreateQuizDto} from './create-quiz.dto';
import {Participant} from '../participant/participant.entity';
import {FirebaseService} from '../firebase/firebase/firebase.service';
import {StartQuizDto} from './start-quiz.dto';
import {Question} from '../question/question.entity';

@Injectable()
export class QuizService {
    private readonly logger = new Logger('QuizService', true)

    constructor(private readonly connection: Connection,
                @InjectRepository(Quiz)
                private readonly quizRepository: Repository<Quiz>,
                private firebaseService: FirebaseService) {
    }

    async create(quiz: CreateQuizDto): Promise<{quiz: Quiz, token: string }> {
        return await getManager().transaction(async transactionalEntityManager => {
            const storedQuiz = await transactionalEntityManager.getRepository(Quiz).save(quiz);

            return await transactionalEntityManager.getRepository(Participant).save({
                naam: quiz.naam,
                quiz: {id: storedQuiz.id},
                isAdmin: true
            })
                .then(async response => {
                    this.firebaseService.updateQuizMetaData(storedQuiz.id);
                    const token = await admin.auth().createCustomToken(response.id, {admin: true});
                    return {quiz: storedQuiz, token: token}
                })
                .catch((err) => {
                    throw new HttpException({
                        message: err.message,
                        statusCode: HttpStatus.BAD_REQUEST,
                    }, HttpStatus.BAD_REQUEST);
                });
        })
    }

    async setQuizCompleteness(quiz: StartQuizDto): Promise<Quiz> {
        return await this.quizRepository.save(quiz)
            .then(async response => {
               this.firebaseService.updateQuizMetaData(quiz.id);

                if (response.isComplete) {
                    this.firebaseService.setNewQuestion(quiz.id);
                }
                return response;
            })
            .catch((err) => {
                throw new HttpException({
                    message: err.message,
                    statusCode: HttpStatus.BAD_REQUEST,
                }, HttpStatus.BAD_REQUEST);
            });
    }
}
