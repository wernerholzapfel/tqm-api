import {Body, Controller, Post} from '@nestjs/common';
import {QuestionService} from './question.service';
import {Question} from './question.entity';

@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {
    }

    @Post()
    async create(@Body() question: Question) {
        return await this.questionService.create(question);
    }
}
