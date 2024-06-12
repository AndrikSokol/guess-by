import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ApiBody, ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CurrentUserId } from '@/decorators/current-user-id.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(
    @Inject('PROFILE_SERVICE') private readonly profileService: ProfileService,
  ) {}

  @ApiOperation({ summary: 'get user profile' })
  @ApiCookieAuth('access_token')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@CurrentUserId(ParseIntPipe) userId: number) {
    return await this.profileService.getProfile(userId);
  }

  // @ApiOperation({ summary: 'create user profile' })
  // @ApiCookieAuth('access_token')
  // @UseGuards(JwtAuthGuard)
  // @Post()
  // async create(@CurrentUserId(ParseIntPipe) userId: number) {
  //   return await this.profileService.create(userId);
  // }

  @ApiOperation({ summary: 'patch user profile' })
  @ApiCookieAuth('access_token')
  @ApiBody({ type: UpdateProfileDto })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Patch()
  async update(@Body() dto: UpdateProfileDto, @CurrentUserId() userId: number) {
    return await this.profileService.update(dto, userId);
  }

  @ApiOperation({ summary: 'delete user profile' })
  @ApiCookieAuth('access_token')
  @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@CurrentUserId() userId: number) {
    return await this.profileService.delete(userId);
  }
}
