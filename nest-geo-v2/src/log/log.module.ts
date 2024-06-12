import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogMongo } from './entities/log.entity';
import CustomLogger from './customLogger';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([LogMongo], 'mongoConnection'),
    ConfigModule,
  ],
  controllers: [LogController],
  providers: [LogService, CustomLogger],
  exports: [LogService, CustomLogger],
})
export class LogModule {}
