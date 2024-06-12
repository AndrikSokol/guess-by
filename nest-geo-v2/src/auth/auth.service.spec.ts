import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '@/user/user.service';
import { User } from '@/user/entities/user.entity';

const MockUserService = {
  findByEmail: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockUser = new User({
  firstName: 'andrei',
  lastName: 'sokol',
  email: 'test@example.com',
  passwordHash: '123',
});

const mockRegisterDto = {
  firstName: 'andrei',
  lastName: 'sokol',
  email: 'test@example.com',
  password: '123',
};

const mockGoogleAuthDto = {
  id: 5,
  email: 'test@example.com',
  googleId: 'google123',
  firstName: 'andrei',
  lastName: 'sokol',
  photo: 'lalal',
};

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'USER_SERVICE',
          useValue: MockUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>('USER_SERVICE');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(userService, 'create').mockResolvedValue(mockUser);

      const result = await service.register(mockRegisterDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException if user already exists', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);

      await expect(service.register(mockRegisterDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('googleLogin', () => {
    it('should log in existing user with Google account', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser);

      const result = await service.googleLogin(mockGoogleAuthDto);
      expect(result).toEqual(mockUser);
    });

    it('should create new user with Google account if user does not exist', async () => {
      jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(userService, 'create').mockResolvedValue(mockUser);

      const result = await service.googleLogin(mockGoogleAuthDto);
      expect(result).toEqual(mockUser);
    });
  });
});
