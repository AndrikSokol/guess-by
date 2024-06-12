import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import {
  USERNAME_ALREADY_EXISTS,
  USER_ALREADY_EXISTS,
} from '@/constants/response-messages';
import { UserService } from '@/user/user.service';
import { IUser } from '@/user/types/user.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UserService,
  ) {}

  async register(dto: RegisterAuthDto): Promise<IUser> {
    const candidate: IUser | null = await this.userService.findByEmail(
      dto.email,
    );

    const candidateWithSameUsername: IUser | null =
      await this.userService.findByUsername(dto.username);

    if (candidate) {
      throw new BadRequestException(USER_ALREADY_EXISTS);
    }

    if (candidateWithSameUsername) {
      throw new BadRequestException(USERNAME_ALREADY_EXISTS);
    }
    const user = await this.userService.create(dto);

    return user;
  }

  async googleLogin(googleUser: GoogleAuthDto): Promise<IUser> {
    const existingUser: IUser | null = await this.userService.findByEmail(
      googleUser.email,
    );

    if (!existingUser) {
      const newUser = await this.userService.create(googleUser);
      return newUser;
    } else {
      if (existingUser.googleId === null) {
        existingUser.googleId = googleUser.googleId;
        await this.userService.save(existingUser);
      }
    }
    return existingUser;
  }
}
