import { Module } from '@nestjs/common';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { FileModule } from './file/file.module';
import { LogModule } from './log/log.module';
import { LocationModule } from './location/location.module';
import { RoomModule } from './room/room.module';
import { GameModule } from './game/game.module';
import { ScoreModule } from './score/score.module';
import { LevelModule } from './level/level.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.${process.env.NODE_ENV}.env` }),
    DatabaseModule,
    UserModule,
    AuthModule,
    ProfileModule,
    FileModule,
    LogModule,
    LocationModule,
    RoomModule,
    GameModule,
    ScoreModule,
    LevelModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
