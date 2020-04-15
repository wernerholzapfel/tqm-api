import {Module} from '@nestjs/common';
import {AnswerController} from './answer.controller';
import {AnswerService} from './answer.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Answer} from './answer.entity';
import {FirebaseService} from '../firebase/firebase/firebase.service';
import {Participant} from '../participant/participant.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Answer, Participant])],
    controllers: [AnswerController],
    providers: [AnswerService, FirebaseService]
})
export class AnswerModule {
}
