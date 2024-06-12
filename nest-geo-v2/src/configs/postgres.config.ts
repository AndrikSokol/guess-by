import { Game } from '@/game/entities/game.entity';
import { LevelEntity } from '@/level/entities/level.entity';
import { Link } from '@/location/entities/link.entity';
import { Location } from '@/location/entities/location.entity';
import DatabaseLogger from '@/log/databaseLogger';
import { Profile } from '@/profile/entities/profile.entity';
import { Room } from '@/room/entities/room.entity';
import { Score } from '@/score/entities/score.entity';
import { User } from '@/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getPostgresConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions | TypeOrmModuleOptions> => {
  return {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: +configService.get('DB_PORT'),
    username: configService.get('POSTGRESQL_USERNAME'),
    password: configService.get('POSTGRESQL_PASSWORD'),
    database: configService.get('POSTGRESQL_DATABASE'),
    entities: [User, Profile, Room, Game, Score, Location, Link, LevelEntity],
    logger: new DatabaseLogger(),
    synchronize: false,
    // logging: true,
  };
};
