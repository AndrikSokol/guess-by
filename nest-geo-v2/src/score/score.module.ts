import { Module } from '@nestjs/common';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SCORE_SERVICE } from './score.constants';
import { Score } from './entities/score.entity';
import { GameModule } from '@/game/game.module';

@Module({
  imports: [TypeOrmModule.forFeature([Score]), GameModule],
  controllers: [ScoreController],
  providers: [{ useClass: ScoreService, provide: SCORE_SERVICE }],
})
export class ScoreModule {}
