import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { USER_SERIVCE } from './user.constants';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IUser } from './types/user.interface';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUserId } from '@/decorators/current-user-id.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { SetPasswordDto } from './dto/set-password.dto';
import { UserDto } from './dto/user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    @Inject(USER_SERIVCE) private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: 'get current user' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUser(@CurrentUserId() userId: number) {
    return await this.userService.getUser(userId);
  }

  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @CurrentUser() user: IUser,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return await this.userService.changePassword(user, updatePasswordDto);
  }

  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.userService.forgotPassword(forgotPasswordDto);
    return {
      message: 'You have only 15 minutes to change password\nCheck your email!',
    };
  }

  @HttpCode(200)
  @Get('reset-password/:id/:token')
  async verifyToken(
    @Param('id', ParseIntPipe) id: number,
    @Param('token') token: string,
  ) {
    const user = await this.userService.verifyToken(id, token);
    const userDto = new UserDto(user);
    return userDto;
  }

  @HttpCode(200)
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('reset-password/:id/:token')
  async resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Param('token') token: string,
    @Body() setPasswordDto: SetPasswordDto,
  ) {
    return await this.userService.resetPassword(id, token, setPasswordDto);
  }
}
