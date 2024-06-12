import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { Connection, EntityManager, Repository } from 'typeorm';
import { IUser } from './types/user.interface';
import { GoogleAuthDto } from '@/auth/dto/google-auth.dto';
import { RegisterAuthDto } from '@/auth/dto/register-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfileService } from '@/profile/profile.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import * as bcrypt from 'bcryptjs';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '@/email/email.service';
import { ConfigService } from '@nestjs/config';
import { SetPasswordDto } from './dto/set-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => 'PROFILE_SERVICE'))
    private readonly profileService: ProfileService,
    private readonly connection: Connection,
    private readonly jwtService: JwtService,
    @Inject('EMAIL_SERVICE') private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  // async create(dto: RegisterAuthDto | GoogleAuthDto) {
  //   const newUser = new User({
  //     ...dto,
  //     email: dto.email.toLocaleLowerCase(),
  //     passwordHash: (dto as RegisterAuthDto).password,
  //   });

  //   const user = await this.userRepository.save(newUser);
  //   await this.profileService.create(user.id);
  //   return user;
  // }

  async create(dto: RegisterAuthDto | GoogleAuthDto) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const newUser = new User({
      ...dto,
      email: dto.email.toLowerCase(),
      passwordHash: (dto as RegisterAuthDto).password,
    });

    return await this.userRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        const user = await entityManager.save(User, newUser);
        await this.profileService.create(user.id, entityManager);

        return user;
      },
    );
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email: email.toLocaleLowerCase() },
    });
  }

  async findByUsername(username: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { username },
    });
  }

  async findById(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async save(user: IUser) {
    return await this.userRepository.save(user);
  }

  async getUser(userId: number) {
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: { profile: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        email: true,
        profile: { id: true, birthdate: true, avatar: true },
      },
    });
  }

  async changePassword(user: IUser, updatePasswordDto: UpdatePasswordDto) {
    try {
      if (
        !(await bcrypt.compare(updatePasswordDto.password, user.passwordHash))
      ) {
        throw new BadRequestException('Ops your password wrong');
      }

      await this.userRepository.save({
        ...user,
        passwordHash: await this.getPasswordHash(updatePasswordDto.newPassword),
      });
    } catch (error) {
      throw new BadRequestException('Ops your password wrong');
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.findByEmail(forgotPasswordDto.email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const token = await this.jwtService.sign(
      { id: user.id },
      { expiresIn: '15m' },
    );

    const emailData = { to: user.email, subject: user.username };
    const link = `${this.configService.get('FRONTEND_URL')}/forgot-password/${user.id}/${token}`;
    await this.emailService.send(emailData, link);
  }

  async verifyToken(id: number, token: string) {
    try {
      const payload = this.jwtService.verify(token);
      if (payload.id != id) {
        throw new BadRequestException('access was determine ');
      }

      const user = await this.findById(id);

      if (!user) {
        throw new BadRequestException('access was determine ');
      }
      return user;
    } catch (error) {
      throw new BadRequestException('access was determine ');
    }
  }

  async resetPassword(
    id: number,
    token: string,
    setPasswordDto: SetPasswordDto,
  ) {
    const user = await this.verifyToken(id, token);
    return await this.userRepository.save({
      ...user,
      passwordHash: await this.getPasswordHash(setPasswordDto.newPassword),
    });
  }

  private async getPasswordHash(newPassword: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(newPassword, salt);
  }
}
