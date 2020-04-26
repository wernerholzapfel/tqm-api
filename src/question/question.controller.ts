import {Body, Controller, Get, Post, Put, Req} from '@nestjs/common';
import {QuestionService} from './question.service';
import {Question} from './question.entity';
import {SetQuestionAsnweredDto} from './set-question-answerd.dto';

@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {
    }

    @Get()
    async get(@Req() req) {
        return await this.questionService.get(req.user.uid)
    }

    @Post()
    async create(@Req() req, @Body() question: Question) {
        return await this.questionService.create(question, req.user.uid);
    }

    @Put('answered')
    async update(@Req() req, @Body() question: SetQuestionAsnweredDto) {
        return await this.questionService.setNextQuestion(question)
    }
}
