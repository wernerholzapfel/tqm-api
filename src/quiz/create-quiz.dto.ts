import {IsNumber, IsString} from 'class-validator';

export class CreateQuizDto {
    @IsString()
    beschrijving: string;

    @IsString()
    naam: string;

    @IsNumber()
    aantalVragen: number;
}
