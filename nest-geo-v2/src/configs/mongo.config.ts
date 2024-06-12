import { LogMongo } from '@/log/entities/log.entity';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getMongoConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'mongodb',
    url: configService.get('MONGO_URL'),
    useUnifiedTopology: true,
    entities: [LogMongo],
    synchronize: false,
  };
};
