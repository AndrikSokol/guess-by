import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { LOCATION_SERVICE } from './location.constants';
import { LevelModule } from '@/level/level.module';

@Module({
  imports: [TypeOrmModule.forFeature([Location]), LevelModule],
  controllers: [LocationController],
  providers: [{ useClass: LocationService, provide: LOCATION_SERVICE }],
  exports: [{ useClass: LocationService, provide: LOCATION_SERVICE }],
})
export class LocationModule {}
