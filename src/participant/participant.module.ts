import { Module } from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Participant} from './participant.entity';
import {FirebaseService} from '../firebase/firebase/firebase.service';

@Module({
  imports: [TypeOrmModule.forFeature([Participant])],
  controllers: [ParticipantController],
  providers: [ParticipantService, FirebaseService]
})
export class ParticipantModule {}
