import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Participant} from './participant.entity';
import {Connection, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {FirebaseService} from '../firebase/firebase/firebase.service';

@Injectable()
export class ParticipantService {

    constructor(private readonly connection: Connection,
                @InjectRepository(Participant)
                private readonly participantRepository: Repository<Participant>,
                private readonly firebaseService: FirebaseService) {
    }

    async create(participant: Participant): Promise<Participant> {
        return await this.participantRepository.save(participant)
            .then(async response => {
                this.firebaseService.updateParticipantsForQuiz(participant.quiz.id);

                return response;
            })
            .catch((err) => {
                throw new HttpException({
                    message: err.message,
                    statusCode: HttpStatus.BAD_REQUEST,
                }, HttpStatus.BAD_REQUEST);
            });
    }

    async getQuiz(quizId: string): Promise<Participant[]> {
        const quizParticipants =  await this.connection
            .getRepository(Participant)
            .createQueryBuilder('participant')
            .select('participant')
            .addSelect('quiz.beschrijving')
            .loadRelationCountAndMap('participant.questions','participant.questions')
            .leftJoin('participant.quiz', 'quiz')
            .where('quiz.id = :quizId', {quizId})
            .getMany();

        return quizParticipants;
    }
}
