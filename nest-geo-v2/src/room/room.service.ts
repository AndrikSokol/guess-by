import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import { USER_SERIVCE } from '@/user/user.constants';
import { UserService } from '@/user/user.service';
import { ROOM_NOT_FOUND } from './room.constants';
import { PageOptionsDto } from '@/dto/pageOptions.dto';
import { Status } from '@/enum/status.enum';
import { PageMetaDto } from '@/dto/pageMeta.dto';
import { PageDto } from '@/dto/page.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { LevelService } from '@/level/level.service';
import { Level } from '@/enum/level.enum';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room) private readonly roomRepository: Repository<Room>,
    @Inject(USER_SERIVCE) private readonly userService: UserService,
    private readonly levelService: LevelService,
  ) {}

  async create(userId: number) {
    const newRoom = new Room({ status: Status.Proccess });
    const user = await this.userService.findById(userId);
    newRoom.users = [user];
    return await this.roomRepository.save(newRoom);
  }

  async getRoom(link: string) {
    return await this.roomRepository.findOne({
      where: { link },
      relations: { level: true },
    });
  }

  async getActiveRooms(pageOptionsDto: PageOptionsDto) {
    const rooms = await this.roomRepository.find({
      where: { status: Status.Proccess },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });
    const itemCount = await this.roomRepository.count({
      where: { status: Status.Proccess },
    });

    const pageMeta = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(rooms, pageMeta);
  }

  async getUserRooms(userId: number) {
    const rooms = await this.roomRepository.find({
      relations: { users: true, game: true },
      where: { users: { id: userId } },
    });

    return rooms;
  }

  async delete(id: number) {
    const room = await this.roomRepository.findOneBy({ id });
    if (!room) {
      throw new NotFoundException(ROOM_NOT_FOUND);
    }

    return await this.roomRepository.remove(room);
  }

  async setStatusRoom(id: number, status: Status) {
    const room = await this.roomRepository.findOneBy({ id });

    if (!room) {
      throw new NotFoundException(ROOM_NOT_FOUND);
    }

    await this.roomRepository.save({ ...room, status });
  }

  async updateRoomLevel(link: string, updateRoomDto: UpdateRoomDto) {
    const room = await this.roomRepository.findOne({ where: { link } });

    if (!room) {
      throw new NotFoundException(ROOM_NOT_FOUND);
    }

    const existingLevel = await this.levelService.getLevels(
      updateRoomDto.level,
    );

    if (!existingLevel) {
      throw new NotFoundException('Level not found');
    }

    room.level = existingLevel;
    room.levelId = existingLevel.id;
    // Save the room entity along with its relations
    await this.roomRepository.save(room);

    // Reload the room with its updated relations
    const updatedRoom = await this.roomRepository.findOne({
      where: { link },
      relations: { level: true }, // Load the updated relations
    });

    return updatedRoom;
    // room.levelId = existinglevel.id;
    // return await this.roomRepository.save(room);
  }
  // async getRooms() {
  //   const rooms = await this.roomRepository.find({
  //     where: { status: Status.Proccess },
  //     skip: pageOptionsDto.skip,
  //     take: pageOptionsDto.take,
  //   });
  //   const itemCount = await this.roomRepository.count({
  //     where: { status: Status.Proccess },
  //   });

  //   const pageMeta = new PageMetaDto({ itemCount, pageOptionsDto });
  //   return new PageDto(rooms, pageMeta);
  // }
}
