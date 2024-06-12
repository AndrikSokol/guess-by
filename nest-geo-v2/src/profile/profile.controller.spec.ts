import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as vinylUtils from '@/utils/isExistsFIle';

const mockProfile = new Profile({
  id: 1,
  userId: 1,
});

describe('ProfileController', () => {
  let controller: ProfileController;
  let profileService: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        { useClass: ProfileService, provide: 'PROFILE_SERVICE' },
        {
          provide: getRepositoryToken(Profile),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    profileService = module.get<ProfileService>('PROFILE_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const userId = 1;
      jest.spyOn(profileService, 'getProfile').mockResolvedValue(mockProfile);

      const result = await controller.getProfile(userId);

      expect(result).toEqual(mockProfile);
    });
  });

  describe('create', () => {
    it('should create user profile', async () => {
      const userId = 1;
      jest.spyOn(profileService, 'create').mockResolvedValue(mockProfile);

      const result = await controller.create(userId);

      expect(result).toEqual(mockProfile);
    });
  });

  describe('update', () => {
    jest.spyOn(vinylUtils, 'isExistsFile').mockResolvedValue(true);

    it('should update user profile', async () => {
      const updateProfileDto: UpdateProfileDto = {
        firstName: 'andrei',
        lastName: 'sokol,',
        avatar: 'fdaf',
        birthdate: new Date(),
      };
      const userId = 1;
      jest
        .spyOn(profileService, 'update')
        .mockResolvedValue({ ...updateProfileDto, ...mockProfile });

      const result = await controller.update(updateProfileDto, userId);

      expect(result).toEqual({ ...updateProfileDto, ...mockProfile });
    });
  });

  describe('delete', () => {
    it('should delete user profile', async () => {
      const userId = 1;
      jest.spyOn(profileService, 'delete').mockResolvedValue(undefined);

      const result = await controller.delete(userId);

      expect(result).toBeUndefined();
    });
  });
});
