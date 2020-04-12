import {Body, Controller, Logger, Post, Put, Req} from '@nestjs/common';
import {QuizService} from './quiz.service';
import {Quiz} from './quiz.entity';
import {CreateQuizDto} from './create-quiz.dto';

@Controller('quiz')
export class QuizController {
    private readonly logger = new Logger('QuizController', true);

    constructor(private readonly quizService: QuizService) {
    }

    @Post()
    async create(@Body() quiz: CreateQuizDto) {
        this.logger.log(quiz);
        return await this.quizService.create(quiz);
    }

    @Put()
    async update(@Req() req, @Body() quiz: Quiz) {
        return await this.quizService.update(quiz)
    }
}
