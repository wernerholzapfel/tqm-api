import {IsString} from 'class-validator';

export class CreateQuizDto {
    @IsString()
    beschrijving: string;
    @IsString()
    aantalVragen: number;
}
