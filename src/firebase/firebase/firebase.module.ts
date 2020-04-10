import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Participant} from '../../participant/participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Participant])],
  providers: [FirebaseService]
})
export class FirebaseModule {}
