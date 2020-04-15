import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Quiz} from '../quiz/quiz.entity';
import {Participant} from '../participant/participant.entity';
import {Answer} from '../answer/answer.entity';

@Entity()
export class Question {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    vraag: string;

    @Column({nullable: false})
    a: string;

    @Column({nullable: false})
    b: string;

    @Column({nullable: false})
    c: string;

    @Column({nullable: false})
    d: string;

    @Column({default: false})
    isAnswered: boolean;

    @ManyToOne(type => Participant, participant => participant.questions, {nullable: false})
    owner: Participant;

    @ManyToOne(type => Quiz, quiz => quiz.questions, {nullable: false})
    quiz: Quiz;

    @OneToMany(type => Answer, answer => answer.question)
    answers: Answer[];

    @UpdateDateColumn()
    updatedDate: Date;

    @CreateDateColumn()
    createdDate: Date;
}
