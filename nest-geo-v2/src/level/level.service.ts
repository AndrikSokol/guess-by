import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LevelEntity } from './entities/level.entity';
import { Repository } from 'typeorm';
import { Level } from '@/enum/level.enum';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(LevelEntity)
    private readonly levelRepository: Repository<LevelEntity>,
  ) {}

  async getLevels(level: Level) {
    return await this.levelRepository.findOne({ where: { name: level } });
  }

  async getLevel(level: Level) {
    return await this.levelRepository.findOne({ where: { name: level } });
  }
}
