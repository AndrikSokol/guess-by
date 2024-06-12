import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Score } from './entities/score.entity';
import { GAME_SERVICE } from '@/game/game.constants.';
import { GameService } from '@/game/game.service';
import { AddScoreDto } from './dto/add-score.dto';
import { calculateMapScoreFactor } from '@/utils/calculateMapScoreFactor';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
    @Inject(GAME_SERVICE) private readonly gameService: GameService,
  ) {}

  async getScoreOfUser(userId: number, link: string) {
    const scores = await this.scoreRepository.find({
      where: { userId, game: { link } },
      relations: { game: true },
    });

    return scores;
  }

  // add to check this user in game for get scores
  async getScoreOfUsers(userId: number, link: string) {
    const scores = await this.scoreRepository.find({
      where: { game: { link } },
      relations: { game: true, user: true },
    });

    return scores;
  }

  async addScoreOfUser(userId: number, addScoreDto: AddScoreDto) {
    const scores = await this.scoreRepository.find({
      where: { userId, game: { link: addScoreDto.link } },
      relations: { game: true },
    });

    const scoreInRound = scores.filter(
      (score) => score.round === score.game.round,
    );

    if (scoreInRound.length > 0) {
      throw new BadRequestException('you already answered');
    }

    const game = await this.gameService.getGameByLink(addScoreDto.link, userId);

    const score = calculateMapScoreFactor({
      marker: addScoreDto.marker,
      location: addScoreDto.location,
    });

    const newScore = new Score({
      userId: userId,
      gameId: game.id,
      score: Number(score.toFixed(5)),
      round: game.round,
    });
    return await this.scoreRepository.save(newScore);
  }
}
