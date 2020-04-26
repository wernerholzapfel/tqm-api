import {MiddlewareConsumer, Module, RequestMethod} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ormconfig} from './ormconfig';
import {QuizModule} from './quiz/quiz.module';
import {ParticipantModule} from './participant/participant.module';
import {QuestionModule} from './question/question.module';
import {FirebaseModule} from './firebase/firebase/firebase.module';
import {AddFireBaseUserToRequest} from './middleware/authentication.middleware';
import { AnswerModule } from './answer/answer.module';

@Module({
    imports: [
        TypeOrmModule.forRoot(ormconfig),
        QuizModule,
        ParticipantModule,
        QuestionModule,
        FirebaseModule,
        AnswerModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {

    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AddFireBaseUserToRequest).forRoutes(
            {path: '/question', method: RequestMethod.POST},
            {path: '/question', method: RequestMethod.GET},
            {path: '/answer', method: RequestMethod.POST},
            )
    };
}


// todo guard toevoegen voor vragen controle
// todo guard toevoegen voor authenticatie
