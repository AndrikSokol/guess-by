import { getMongoConfig } from '@/configs/mongo.config';
import { getPostgresConfig } from '@/configs/postgres.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getPostgresConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: 'mongoConnection',
      imports: [ConfigModule],
      useFactory: getMongoConfig,
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
