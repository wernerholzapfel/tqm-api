import {Body, Controller, Get, Post, Req} from '@nestjs/common';
import {Question} from '../question/question.entity';
import {QuestionService} from '../question/question.service';
import {AnswerService} from './answer.service';
import {Answer} from './answer.entity';
import {CreateAnswerDto} from './create-answer.dto';

@Controller('answer')
export class AnswerController {

    constructor(private readonly answerService: AnswerService) {
    }

    @Post()
    async create(@Req() req, @Body() answer: CreateAnswerDto) {
        return await this.answerService.create(answer, req.user.uid);
    }

    @Get()
    async getStand(@Req() req, @Body() body: any) {
        return await this.answerService.getStand('d6499910-9a34-471a-b8f2-cfbb356f6c1b')
    }
}
