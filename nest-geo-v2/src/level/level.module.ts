import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelEntity } from './entities/level.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LevelEntity])],
  providers: [LevelService],
  exports: [LevelService],
})
export class LevelModule {}
