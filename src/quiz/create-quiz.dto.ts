import {IsNumber, IsString} from 'class-validator';

export class CreateQuizDto {
    @IsString()
    beschrijving: string;

    @IsNumber()
    aantalVragen: number;
}
