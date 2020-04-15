import {Body, Controller, Post, Req} from '@nestjs/common';
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
}
