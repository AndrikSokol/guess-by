import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), UserModule],
  controllers: [ProfileController],
  providers: [{ provide: 'PROFILE_SERVICE', useClass: ProfileService }],
  exports: [{ provide: 'PROFILE_SERVICE', useClass: ProfileService }],
})
export class ProfileModule {}
