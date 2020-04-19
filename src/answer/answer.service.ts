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
        return this.firebaseService.updateTable(quizId);
    }


}
