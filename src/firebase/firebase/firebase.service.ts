import { Injectable } from '@nestjs/common';
import {Participant} from '../../participant/participant.entity';
import {Connection, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import * as admin from 'firebase-admin';
import {Quiz} from '../../quiz/quiz.entity';

@Injectable()
export class FirebaseService {


    // todo update active question
    // todo update stand

    constructor(private readonly connection: Connection,
                 @InjectRepository(Participant)
                 private readonly participantRepository: Repository<Participant>) {}

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
}

