import {IsString} from 'class-validator';

export class CreateAnswerDto {
    @IsString()
    answer: string;

    @IsString()
    quizId: string;

}
