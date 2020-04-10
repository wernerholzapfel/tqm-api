import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import * as admin from 'firebase-admin';
import {Question} from './question.entity';
import {FirebaseService} from '../firebase/firebase/firebase.service';

@Injectable()
export class QuestionService {
    constructor(private readonly connection: Connection,
                @InjectRepository(Question)
                private readonly questionRepository: Repository<Question>,
                private readonly firebaseService: FirebaseService) {
    }

    async create(question: Question): Promise<Question> {
        return await this.questionRepository.save(question)
            .then(response => {
                this.firebaseService.updateParticipantsForQuiz(question.quiz.id)

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
