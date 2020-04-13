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
import {Question} from '../question/question.entity';

@Entity()
export class Participant {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    naam: string;

    @Column({default: false})
    isAdmin: boolean;

    @ManyToOne(type => Quiz, quiz => quiz.participants, {nullable: false})
    quiz: Quiz;

    @OneToMany(type => Question, question => question.owner)
    questions: Question[];

    @UpdateDateColumn()
    updatedDate: Date;

    @CreateDateColumn()
    createdDate: Date;
}
