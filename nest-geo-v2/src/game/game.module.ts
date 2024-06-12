import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GAME_SERVICE } from './game.constants.';
import { LocationModule } from '@/location/location.module';
import { RoomModule } from '@/room/room.module';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), LocationModule, RoomModule],
  controllers: [GameController],
  providers: [{ useClass: GameService, provide: GAME_SERVICE }],
  exports: [{ useClass: GameService, provide: GAME_SERVICE }],
})
export class GameModule {}
