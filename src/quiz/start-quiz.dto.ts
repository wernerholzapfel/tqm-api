import {IsBoolean, IsString} from 'class-validator';

export class StartQuizDto {
    @IsString()
    id: string;

    @IsBoolean()
    isComplete: boolean;
}
