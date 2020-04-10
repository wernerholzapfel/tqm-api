import {Body, Controller, Post, Req} from '@nestjs/common';
import {QuestionService} from './question.service';
import {Question} from './question.entity';

@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {
    }

    @Post()
    async create(@Req() req, @Body() question: Question) {
        return await this.questionService.create(question, req.user.uid);
    }
}
