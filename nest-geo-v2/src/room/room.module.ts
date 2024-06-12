import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { UserModule } from '@/user/user.module';
import { ROOM_SERVICE } from './room.constants';
import { LevelModule } from '@/level/level.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), UserModule, LevelModule],
  controllers: [RoomController],
  providers: [{ useClass: RoomService, provide: ROOM_SERVICE }],
  exports: [{ useClass: RoomService, provide: ROOM_SERVICE }],
})
export class RoomModule {}
