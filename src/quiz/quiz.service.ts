import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import {Quiz} from './quiz.entity';
import * as admin from 'firebase-admin';

@Injectable()
export class QuizService {
    constructor(private readonly connection: Connection,
                @InjectRepository(Quiz)
                private readonly quizRepository: Repository<Quiz>) {
    }

    async create(quiz: Quiz): Promise<Quiz> {
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
