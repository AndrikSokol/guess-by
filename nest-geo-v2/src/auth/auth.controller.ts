import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { UserDto } from '@/user/dto/user.dto';
import { IUser } from '@/user/types/user.interface';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response } from 'express';
import { GoogleAuth } from './guards/google-auth.guard';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOkResponse({ description: 'user was created' })
  @ApiBody({ type: RegisterAuthDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('register')
  async register(
    @Body() registerAuthDto: RegisterAuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.register(registerAuthDto);

    const accessToken = await this.jwtService.signAsync({ id: user.id });
    response.cookie('access_token', accessToken);
    const userDto = new UserDto(user);
    return userDto;
  }

  @ApiOkResponse({ description: 'successful login' })
  @ApiNotFoundResponse({ description: 'user not found' })
  @ApiUnauthorizedResponse({ description: 'unathorized' })
  @HttpCode(200)
  @ApiBody({ type: LoginAuthDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: IUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessToken = await this.jwtService.signAsync({ id: user.id });
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    const userDto = new UserDto(user);
    return userDto;
  }

  @ApiCookieAuth('access_token')
  @ApiOkResponse({ description: 'logout from system' })
  @ApiUnauthorizedResponse({ description: 'unathorized' })
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
  }

  @UseGuards(GoogleAuth)
  @Get('google/login')
  async googleAuth() {}

  @UseGuards(GoogleAuth)
  @Get('google/callback')
  async googleAuthRedirect(
    @CurrentUser() googleUser: GoogleAuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.googleLogin(googleUser);
    const accessToken = await this.jwtService.signAsync({ id: user.id });
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
    });
    response.redirect(`${this.configService.get('FRONTEND_URL')}`);
  }
}
