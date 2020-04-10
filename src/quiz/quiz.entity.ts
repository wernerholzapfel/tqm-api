import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Participant} from '../participant/participant.entity';
import {Question} from '../question/question.entity';

@Entity()
export class Quiz {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    beschrijving: string;

    @Column()
    aantalVragen: number;

    @OneToMany(type => Participant, Participant => Participant.quiz)
    participant: Participant[];

    @OneToMany(type => Question, question => question.owner)
    questions: Question[];

    @UpdateDateColumn()
    updatedDate: Date;

    @CreateDateColumn()
    createdDate: Date;
}
