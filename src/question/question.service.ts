import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Connection, Repository, UpdateResult} from 'typeorm';
import {Question} from './question.entity';
import {FirebaseService} from '../firebase/firebase/firebase.service';
import {SetQuestionAsnweredDto} from './set-question-answerd.dto';

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

    async get(participantId): Promise<Question[]> {
        return await this.connection.getRepository(Question)
            .createQueryBuilder('question')
            .leftJoin('question.quiz', 'quiz')
            .leftJoin('question.owner', 'owner')
            .where('owner.id = :participantId', {participantId})
            .getMany();
    }

    // todo check if admin
    async setNextQuestion(question: SetQuestionAsnweredDto): Promise<UpdateResult> {
        const updateResult = await this.connection.createQueryBuilder()
            .update(Question)
            .set({ isAnswered: true})
            .where("id = :id", { id: question.id })
            .execute();

        await this.firebaseService.setNewQuestion(question.quizId);
        await this.firebaseService.updateTable(question.quizId);
        return updateResult;
    }
}
