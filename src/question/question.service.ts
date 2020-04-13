import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import {Question} from './question.entity';
import {FirebaseService} from '../firebase/firebase/firebase.service';

@Injectable()
export class QuestionService {
    constructor(private readonly connection: Connection,
                @InjectRepository(Question)
                private readonly questionRepository: Repository<Question>,
                private readonly firebaseService: FirebaseService) {
    }

    // todo create getNextQuestion {previous: string}
    // set previous isAnswered
    // set active question firebase
    // update stand

    async create(question: Question, particpantId: string): Promise<Question> {
        return await this.questionRepository.save({
            ...question,
            owner: {id: particpantId}
        })
            .then(response => {
                this.firebaseService.updateQuizMetaData(question.quiz.id);
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
