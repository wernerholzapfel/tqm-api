import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Participant} from '../participant/participant.entity';
import {Connection, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {FirebaseService} from '../firebase/firebase/firebase.service';
import * as admin from 'firebase-admin'
import {Quiz} from '../quiz/quiz.entity';

@Injectable()
export class ParticipantService {

    constructor(private readonly connection: Connection,
                @InjectRepository(Participant)
                private readonly participantRepository: Repository<Participant>,
                private readonly firebaseService: FirebaseService) {
    }

    async create(participant: Participant): Promise<{ token: string }> {
        return await this.participantRepository.save(participant)
            .then(async response => {
                this.firebaseService.updateQuizMetaData(participant.quiz.id);
                const token = await admin.auth().createCustomToken(response.id);
                return {token: token}
            })
            .catch((err) => {
                throw new HttpException({
                    message: err.message,
                    statusCode: HttpStatus.BAD_REQUEST,
                }, HttpStatus.BAD_REQUEST);
            });
    }

    async getQuiz(quizId: string): Promise<Quiz> {
        const quizParticipants = await this.connection
            .getRepository(Quiz)
            .createQueryBuilder('quiz')
            .leftJoinAndSelect('quiz.participants', 'participants')
            .loadRelationCountAndMap('participants.questions', 'participants.questions')
            .where('quiz.id = :quizId', {quizId})
            .getOne();

        return quizParticipants;
    }
}
