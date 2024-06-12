import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Profile } from './profile/entities/profile.entity';
import { Room } from './room/entities/room.entity';
import { Link } from './location/entities/link.entity';
import { Game } from './game/entities/game.entity';
import { Score } from './score/entities/score.entity';
import { Location } from './location/entities/location.entity';
import { LevelEntity } from './level/entities/level.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  database: 'geo_game',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  synchronize: false,
  entities: [User, Profile, Room, Link, Game, Score, Location, LevelEntity],
  migrations: ['src/migrations/*{.ts,.js}'],
});

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default dataSource;
