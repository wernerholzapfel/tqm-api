import {IsBoolean, IsString} from 'class-validator';

export class SetQuestionAsnweredDto {
    @IsString()
    id: string;

    @IsString()
    quizId: string;
}
