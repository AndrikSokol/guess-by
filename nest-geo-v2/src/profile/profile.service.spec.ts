import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';

import * as vinylUtils from '@/utils/isExistsFIle';
import { UserService } from '@/user/user.service';

const mockProfile = new Profile({
  id: 1,
  userId: 1,
});

const mockUserService = {
  save: jest.fn(),
};

describe('ProfileService', () => {
  let service: ProfileService;
  let profileRepository: Repository<Profile>;
  let userService: UserService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: getRepositoryToken(Profile),
          useClass: Repository,
        },
        {
          provide: 'USER_SERVICE',
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    profileRepository = module.get<Repository<Profile>>(
      getRepositoryToken(Profile),
    );
    userService = module.get<UserService>('USER_SERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be defined userService', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new profile', async () => {
      jest.spyOn(profileRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(profileRepository, 'save').mockResolvedValue(mockProfile);

      const userId = 1;
      const result = await service.create(userId);

      expect(result).toEqual(mockProfile);
    });

    it('should throw BadRequestException if profile already exists', async () => {
      jest.spyOn(profileRepository, 'findOne').mockResolvedValue(mockProfile);

      const userId = 1;
      await expect(service.create(userId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    jest.spyOn(vinylUtils, 'isExistsFile').mockResolvedValue(true);

    const updateProfileDto: UpdateProfileDto = {
      firstName: 'andrei',
      lastName: 'sokol,',
      avatar: 'fdaf',
      birthdate: new Date(),
    };

    it('should update the profile', async () => {
      jest.spyOn(profileRepository, 'findOne').mockResolvedValue(mockProfile);

      jest
        .spyOn(profileRepository, 'save')
        .mockResolvedValue({ ...updateProfileDto, ...mockProfile });

      const userId = 1;
      const result = await service.update(updateProfileDto, userId);

      expect(result).toEqual({ ...updateProfileDto, ...mockProfile });
    });

    it('should throw NotFoundException if profile does not exist', async () => {
      jest.spyOn(profileRepository, 'findOne').mockResolvedValue(null);
      const userId = 1;
      await expect(service.update(updateProfileDto, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw TypeError if avatar file does not exist', async () => {
      jest.spyOn(profileRepository, 'findOne').mockResolvedValue(mockProfile);

      const userId = 1;
      await expect(service.update(updateProfileDto, userId)).rejects.toThrow(
        TypeError,
      );
    });
  });

  describe('getProfile', () => {
    it('should return profile by user ID', async () => {
      jest.spyOn(profileRepository, 'findOne').mockResolvedValue(mockProfile);

      const userId = 1;
      const result = await service.getProfile(userId);

      expect(result).toEqual(mockProfile);
    });

    it('should throw NotFoundException if profile does not exist', async () => {
      jest.spyOn(profileRepository, 'findOne').mockResolvedValue(null);

      const userId = 1;
      await expect(service.getProfile(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete the profile', async () => {
      jest
        .spyOn(profileRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      const userId = 1;
      const result = await service.delete(userId);

      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException if profile does not exist', async () => {
      jest.spyOn(profileRepository, 'delete').mockResolvedValue(null);

      const userId = 1;
      await expect(service.delete(userId)).rejects.toThrow(NotFoundException);
    });
  });
});
