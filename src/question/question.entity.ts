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
import {Quiz} from '../quiz/quiz.entity';

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

    @ManyToOne(type => Participant, participant => participant.questions, {nullable: false})
    owner: Participant;

    @ManyToOne(type => Quiz, quiz => quiz.questions, {nullable: false})
    quiz: Quiz;

    @UpdateDateColumn()
    updatedDate: Date;

    @CreateDateColumn()
    createdDate: Date;
}
