import {Body, Controller, Get, HttpException, HttpStatus, Post} from '@nestjs/common';
import {ParticipantService} from './participant.service';
import {Participant} from '../participant/participant.entity';

@Controller('participant')
export class ParticipantController {

    constructor(private readonly participantService: ParticipantService) {
    }

    @Post()
    async create(@Body() participantDto: Participant) {
        return await this.participantService.create(participantDto);

    }

    @Get()
    async get() {
        // throw new HttpException({
        //     message: 'Niet geimplementeerd',
        //     statusCode: HttpStatus.NOT_IMPLEMENTED,
        // }, HttpStatus.NOT_IMPLEMENTED);
        return await this.participantService.getQuiz('81300c80-901f-4531-bb77-9d038beafdf9')
    }
}
