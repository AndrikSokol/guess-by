import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TokenPayload } from '../types/token-payload.type';
import { Request } from 'express';
import { UserService } from '@/user/user.service';
import { IUser } from '@/user/types/user.interface';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    @Inject('USER_SERVICE') private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JWTStrategy.extractTokenFromCookie,
      ]),
      secretOrKey: configService.get('JWT_ACCESS_TOKEN'),
    });
  }

  async validate({ id }: TokenPayload): Promise<IUser> {
    if (!id) {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.userService.findById(id);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  private static extractTokenFromCookie(req: Request): string | null {
    if (req.cookies && req.cookies.access_token) {
      return req.cookies.access_token;
    }
    return null;
  }
}
