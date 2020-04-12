import {Body, Controller, Post, Put, Req} from '@nestjs/common';
import {QuizService} from './quiz.service';
import {Quiz} from './quiz.entity';
import {CreateQuizDto} from './create-quiz.dto';

@Controller('quiz')
export class QuizController {
    constructor(private readonly quizService: QuizService) {
    }

    @Post()
    async create(@Body() quiz: CreateQuizDto) {
        return await this.quizService.create(quiz);
    }

    @Put()
    async update(@Req() req, @Body() quiz: Quiz) {
        return await this.quizService.update(quiz)
    }
}
