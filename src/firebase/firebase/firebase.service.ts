import { Injectable } from '@nestjs/common';
import {Participant} from '../../participant/participant.entity';
import {Connection, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {


    // todo update metadata
    // todo update active question
    // todo update stand

    constructor(private readonly connection: Connection,
                 @InjectRepository(Participant)
                 private readonly participantRepository: Repository<Participant>) {}

    async updateParticipantsForQuiz(quizId: string) {

        const db = admin.database();
        const docRef = db.ref(`${quizId}/participants`);

        const quizParticipants =  await this.connection
            .getRepository(Participant)
            .createQueryBuilder('participant')
            .select('participant')
            .addSelect('quiz.beschrijving')
            .loadRelationCountAndMap('participant.questions','participant.questions')
            .leftJoin('participant.quiz', 'quiz')
            .where('quiz.id = :quizId', {quizId})
            .getMany();

        docRef.set(quizParticipants);

        // todo return something for error handling
    }
}

