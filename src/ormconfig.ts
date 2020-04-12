import 'dotenv/config';
import {TypeOrmModuleOptions} from '@nestjs/typeorm';
import {Participant} from './participant/participant.entity';
import {Quiz} from './quiz/quiz.entity';
import {Question} from './question/question.entity';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export const ormconfig: TypeOrmModuleOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    entities: [Participant, Quiz, Question],
    logging: true,
    synchronize: false, // DEV only, do not use on PROD!
};
