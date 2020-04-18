import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Participant} from '../participant/participant.entity';
import {Question} from '../question/question.entity';
import {Answer} from '../answer/answer.entity';

@Entity()
export class Quiz {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    beschrijving: string;

    @Column()
    aantalVragen: number;

    @Column({default: false})
    isComplete: boolean;

    @OneToMany(type => Participant, Participant => Participant.quiz)
    participants: Participant[];

    @OneToMany(type => Question, question => question.owner)
    questions: Question[];

    @OneToMany(type => Answer, answer => answer.quiz)
    answers: Answer[];

    @UpdateDateColumn()
    updatedDate: Date;

    @CreateDateColumn()
    createdDate: Date;
}
