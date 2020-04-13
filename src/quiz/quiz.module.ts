import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Quiz} from './quiz.entity';
import {FirebaseService} from '../firebase/firebase/firebase.service';
import {Participant} from '../participant/participant.entity';

@Module({

  imports: [TypeOrmModule.forFeature([Quiz, Participant])],
  providers: [QuizService, FirebaseService],
  controllers: [QuizController]
})
export class QuizModule {}
