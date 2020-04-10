import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Question} from './question.entity';
import {QuestionService} from './question.service';
import {QuestionController} from './question.controller';
import {FirebaseService} from '../firebase/firebase/firebase.service';
import {Participant} from '../participant/participant.entity';

@Module({

  imports: [TypeOrmModule.forFeature([Question, Participant])],
  providers: [QuestionService, FirebaseService],
  controllers: [QuestionController]
})
export class QuestionModule {}
