import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { USER_SERIVCE } from './user.constants';
import { UserController } from './user.controller';
import { ProfileModule } from '@/profile/profile.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from '@/configs/jwt.config';
import { EmailModule } from '@/email/email.module';

@Module({
  imports: [
    ConfigModule,
    EmailModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
    forwardRef(() => ProfileModule),
  ],
  controllers: [UserController],
  providers: [{ useClass: UserService, provide: USER_SERIVCE }],
  exports: [{ useClass: UserService, provide: USER_SERIVCE }],
})
export class UserModule {}
