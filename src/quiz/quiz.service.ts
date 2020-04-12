import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import {Quiz} from './quiz.entity';
import * as admin from 'firebase-admin';
import {CreateQuizDto} from './create-quiz.dto';

@Injectable()
export class QuizService {
    private readonly logger = new Logger('QuizService', true)

    constructor(private readonly connection: Connection,
                @InjectRepository(Quiz)
                private readonly quizRepository: Repository<Quiz>) {
    }

    async create(quiz: CreateQuizDto): Promise<Quiz>{
        this.logger.log(quiz);
        return await this.quizRepository.save(quiz)
            .then(response => {
                const db = admin.database();
                const docRef = db.ref(`${response.id}`);
                docRef.set(response);

                return response;
            })
            .catch((err) => {
                throw new HttpException({
                    message: err.message,
                    statusCode: HttpStatus.BAD_REQUEST,
                }, HttpStatus.BAD_REQUEST);
            });
    }

    async update(quiz: Quiz): Promise<Quiz> {
        return await this.quizRepository.save(quiz)
            .then(response => {
                const db = admin.database();
                const docRef = db.ref(`${response.id}`);
                docRef.set(response);

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
