import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    Index,
    Unique
} from 'typeorm';
import {Question} from '../question/question.entity';
import {Participant} from '../participant/participant.entity';

@Entity()
@Unique(['participant', 'question'])
export class Answer {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    answer: string;

    @ManyToOne(type => Participant, participant => participant.answers, {nullable: false})
    participant: Participant;

    @ManyToOne(type => Question, question => question.answers, {nullable: false})
    question: Question;

    @UpdateDateColumn()
    updatedDate: Date;

    @CreateDateColumn()
    createdDate: Date;
}
