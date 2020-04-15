import 'dotenv/config';
import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import {Participant} from './participant/participant.entity';
import {Quiz} from './quiz/quiz.entity';
import {Question} from './question/question.entity';
import {Answer} from './answer/answer.entity';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export const ormconfig: TypeOrmModuleOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    entities: [Participant, Quiz, Question, Answer],
    logging: true,
    synchronize: true, // DEV only, do not use on PROD!
};
