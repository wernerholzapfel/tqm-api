import {Injectable, Logger} from '@nestjs/common';
import {Participant} from '../../participant/participant.entity';
import {Connection, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import * as admin from 'firebase-admin';
import {Quiz} from '../../quiz/quiz.entity';
import {Question} from '../../question/question.entity';

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
}

