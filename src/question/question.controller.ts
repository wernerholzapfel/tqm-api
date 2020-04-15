import {Body, Controller, Get, Post, Put, Req} from '@nestjs/common';
import {QuestionService} from './question.service';
import {Question} from './question.entity';
import {SetQuestionAsnweredDto} from './set-question-answerd.dto';

@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {
    }

    @Get()
    async get() {
        return await this.questionService.get('2fa45d7d-a7cd-4142-b44f-017eff5c5b12')
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
