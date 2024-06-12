import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { In, Repository } from 'typeorm';
import { Level } from '@/enum/level.enum';
import { LevelService } from '@/level/level.service';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    private readonly levelService: LevelService,
  ) {}

  async getRandomLocations(count: number = 5) {
    const itemCount = await this.locationRepository.count();
    const locationsId = Array.from({ length: count }, () =>
      Math.floor(Math.random() * itemCount),
    );

    const locations = await this.locationRepository.find({
      where: { id: In(locationsId) },
    });

    return locations;
  }

  async getRandomLandmarkLocations(count: number = 5, level: Level) {
    const existingLevel = await this.levelService.getLevel(level);
    const locations = await this.locationRepository.find({
      where: { level: existingLevel },
    });

    const locationsId = Array.from({ length: count }, () =>
      Math.floor(Math.random() * locations.length),
    );

    const landmarklocations = locationsId.map((location) => {
      return locations[location];
    });

    return landmarklocations;
  }
}
