import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ScoreService } from './score.service';
import { SCORE_SERVICE } from './score.constants';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUserId } from '@/decorators/current-user-id.decorator';
import { AddScoreDto } from './dto/add-score.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('score')
@Controller('score')
export class ScoreController {
  constructor(
    @Inject(SCORE_SERVICE) private readonly scoreService: ScoreService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':gameLink')
  async getScoreOfUser(
    @CurrentUserId() userId: number,
    @Param('gameLink') link: string,
  ) {
    return await this.scoreService.getScoreOfUser(userId, link);
  }

  @UseGuards(JwtAuthGuard)
  @Get('game/:gameLink')
  async getScoreOfUsers(
    @Param('gameLink') link: string,
    @CurrentUserId() userId: number,
  ) {
    return await this.scoreService.getScoreOfUsers(userId, link);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addScoreOfUser(
    @Body() addScoreDto: AddScoreDto,
    @CurrentUserId() userId: number,
  ) {
    return await this.scoreService.addScoreOfUser(userId, addScoreDto);
  }
}
