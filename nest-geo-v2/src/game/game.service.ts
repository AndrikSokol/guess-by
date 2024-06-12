import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { EntityManager, In, Repository } from 'typeorm';
import { LOCATION_SERVICE } from '@/location/location.constants';
import { LocationService } from '@/location/location.service';
import { StatusGame } from '@/enum/status.enum';
import { ROOM_SERVICE } from '@/room/room.constants';
import { RoomService } from '@/room/room.service';
import { LeaderboardDto } from './dto/leaderboard-game.dto';
import { PageMetaDto } from '@/dto/pageMeta.dto';
import { PageDto } from '@/dto/page.dto';
import { Level } from '@/enum/level.enum';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    @Inject(LOCATION_SERVICE)
    private readonly locationService: LocationService,
    @Inject(ROOM_SERVICE) private readonly roomService: RoomService,
    private readonly entityManager: EntityManager,
  ) {}

  async create({
    roomId,
    totalRounds,
    level,
  }: {
    roomId: number;
    totalRounds: number;
    level: Level;
  }) {
    let locations;

    if (level === Level.Landmark) {
      locations = await this.locationService.getRandomLandmarkLocations(
        totalRounds,
        level,
      );
    } else {
      locations = await this.locationService.getRandomLocations(totalRounds);
    }

    const game = new Game({ roomId, totalRounds });
    game.locations = locations;

    return await this.gameRepository.save(game);
  }

  async getUserGames(userId: number) {
    const rooms = await this.roomService.getUserRooms(userId);
    const gameIds = rooms.reduce((acc, curr) => {
      if (curr.game) {
        acc.push(curr.game.id);
      }
      return acc;
    }, []);
    const games = await this.gameRepository.find({
      where: { id: In(gameIds) },
      relations: { scores: true },
    });
    return games;
  }

  async getUsersGames(leaderboardDto: LeaderboardDto) {
    let queryWithoutPagination = `
    SELECT 
    u.id AS "userId",
    u.username,
    COUNT(g.id) AS "totalGames",
    SUM(g.round) AS "totalRounds",
    SUM(EXTRACT(EPOCH FROM (g.updated_at - g.created_at)) / 60) AS "totalTimeMinutes"
FROM 
    "user" u
JOIN (
    SELECT ur."userId", r.id AS room_id
    FROM room_users_user ur
    JOIN room r ON ur."roomId" = r.id
) AS ur ON u.id = ur."userId"
JOIN game g ON ur.room_id = g.room_id
GROUP BY 
    u.id , 
    u.username
ORDER BY `;

    let queryWithPagination = queryWithoutPagination;
    let orderByAdded = false;

    if (leaderboardDto?.orderUsername) {
      queryWithPagination += `${orderByAdded ? ',' : ''} \n u.username ${leaderboardDto.orderUsername}`;
      orderByAdded = true;
    }

    if (leaderboardDto?.orderTotalRounds) {
      queryWithPagination += `${orderByAdded ? ',' : ''} \n"totalRounds" ${leaderboardDto.orderTotalRounds}`;
      orderByAdded = true;
    }

    if (leaderboardDto?.orderTotalGame) {
      queryWithPagination += `${orderByAdded ? ',' : ''} \n"totalGames" ${leaderboardDto.orderTotalGame}`;
      orderByAdded = true;
    }

    if (leaderboardDto?.orderTotalTime) {
      queryWithPagination += `${orderByAdded ? ',' : ''} \n"totalTimeMinutes" ${leaderboardDto.orderTotalTime}`;
      orderByAdded = true;
    }

    if (leaderboardDto.order) {
      queryWithPagination += `${orderByAdded ? ',' : ''} \nu.id  ${leaderboardDto.order}`;
    }

    queryWithPagination += `\nLIMIT ${leaderboardDto.take} OFFSET ${leaderboardDto.skip};`;

    const users = await this.entityManager.query(queryWithPagination);

    queryWithoutPagination += `\nu.id  ${leaderboardDto.order}`;

    const allUsers = await this.entityManager.query(queryWithoutPagination);

    const pageOptionsDto = {
      page: leaderboardDto.page,
      take: leaderboardDto.take,
      skip: leaderboardDto.skip,
    };

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: allUsers.length,
    });

    const page = new PageDto(users, pageMetaDto);
    return page;
  }

  async getGameByLink(link: string, userId: number) {
    const game = await this.gameRepository.findOne({
      where: { link, room: { users: { id: userId } } },
      relations: { locations: true, room: true },
    });

    if (!game) {
      throw new NotFoundException('game not found');
    }

    return game;
  }

  async updateGame(link: string, userId: number) {
    const game = await this.gameRepository.findOne({
      where: { link },
      relations: { locations: true, room: true },
    });

    if (!game) {
      throw new NotFoundException('game not found');
    }

    game.round += 1;

    if (game.round === game.totalRounds) {
      return await this.gameRepository.save({
        ...game,
        status: StatusGame.FINISHED,
      });
    }
    return await this.gameRepository.save(game);
  }
}

// if (game.room.users.filter((user) => user.id === userId).length === 0) {
//   throw new BadRequestException('you not in this game');
// }
