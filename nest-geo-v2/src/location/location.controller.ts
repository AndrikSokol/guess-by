import { Controller, Inject } from '@nestjs/common';
import { LocationService } from './location.service';
import { LOCATION_SERVICE } from './location.constants';

@Controller('location')
export class LocationController {
  constructor(
    @Inject(LOCATION_SERVICE) private readonly locationService: LocationService,
  ) {}
}
