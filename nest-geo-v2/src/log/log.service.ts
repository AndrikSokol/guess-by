import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LogMongo } from './entities/log.entity';
import { Repository } from 'typeorm';
import { CreateLogDto } from './dto/createLog.dto';
import { QueryLogDto } from './dto/queryLog.dto';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(LogMongo, 'mongoConnection')
    private readonly logRepository: Repository<LogMongo>,
  ) {}

  async getLogs({ context }: QueryLogDto): Promise<LogMongo[]> {
    return await this.logRepository.find({ where: { context } });
  }

  async createLog(log: CreateLogDto) {
    const newLog = await this.logRepository.create(log);
    await this.logRepository.save(newLog, {
      data: {
        isCreatingLogs: true,
      },
    });
    return newLog;
  }
}
