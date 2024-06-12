import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GameService } from './game.service';
import { GAME_SERVICE } from './game.constants.';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { CreateGameDto } from './dto/create-game.dto';
import { CurrentUserId } from '@/decorators/current-user-id.decorator';
import { LeaderboardDto } from './dto/leaderboard-game.dto';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(
    @Inject(GAME_SERVICE) private readonly gameService: GameService,
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createGameDto: CreateGameDto) {
    return await this.gameService.create(createGameDto);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard)
  @Get(':link')
  async getGame(@Param('link') link: string, @CurrentUserId() userId: number) {
    return await this.gameService.getGameByLink(link, userId);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard)
  @Get('user/statistics')
  async getUserGames(@CurrentUserId() userId: number) {
    return await this.gameService.getUserGames(userId);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('users/leaderboard')
  async getUsersGames(@Query() leaderboardDto: LeaderboardDto) {
    return await this.gameService.getUsersGames(leaderboardDto);
  }

  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard)
  @Post(':link')
  async updateGame(
    @Param('link') link: string,
    @CurrentUserId() userId: number,
  ) {
    return await this.gameService.updateGame(link, userId);
  }

  // @UsePipes(new ValidationPipe({ transform: true }))
  // @UseGuards(JwtAuthGuard)
  // @Get(':roomId')
  // async getGameByRoomId(@Param('roomId', ParseIntPipe) roomId: number) {
  //   console.log('hello');
  //   return await this.gameService.getGameByRoomId(roomId);
  // }
}
