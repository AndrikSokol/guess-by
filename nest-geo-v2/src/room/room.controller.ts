import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { ROOM_SERVICE } from './room.constants';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUserId } from '@/decorators/current-user-id.decorator';
import { QueryRoomDto } from './dto/query-room.dto';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from '@/dto/pageOptions.dto';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@ApiTags('room')
@Controller('room')
export class RoomController {
  constructor(
    @Inject(ROOM_SERVICE) private readonly roomService: RoomService,
  ) {}

  @ApiOperation({ summary: 'get active rooms' })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Get()
  async getRooms(@Query() pageOptionsDto: PageOptionsDto) {
    return await this.roomService.getActiveRooms(pageOptionsDto);
  }

  @ApiOperation({ summary: 'create a room' })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@CurrentUserId() userId: number) {
    return await this.roomService.create(userId);
  }

  @ApiOperation({ summary: 'get room by link' })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get(':link')
  async getRoom(@Param('link') link: string) {
    return await this.roomService.getRoom(link);
  }

  @ApiOperation({ summary: 'delete room by id' })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.roomService.delete(id);
  }

  @ApiOperation({ summary: 'update room level by id' })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Patch(':link')
  async updateLevel(
    @Param('link') link: string,
    @Body() updateRoomDto: UpdateRoomDto,
  ) {
    return await this.roomService.updateRoomLevel(link, updateRoomDto);
  }
}
