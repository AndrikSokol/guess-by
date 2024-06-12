import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from '@/user/entities/user.entity';

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

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            googleLogin: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('register', () => {
  //   it('should register a new user', async () => {
  //     jest.spyOn(authService, 'register').mockResolvedValue(mockUser);
  //     jest.spyOn(jwtService, 'signAsync').mockResolvedValue('accessToken');

  //     const response: Partial<Response> = { cookie: jest.fn() };

  //     const result = await controller.register(
  //       mockRegisterDto,
  //       response as Response,
  //     );
  //     expect(result).toEqual(mockUser);
  //     expect(response.cookie).toHaveBeenCalledWith(
  //       'access_token',
  //       'accessToken',
  //     );
  //   });
  // });

  describe('logout', () => {
    it('should logout and clear access token cookie', async () => {
      const response: Partial<Response> = { clearCookie: jest.fn() };

      await controller.logout(response as Response);
      expect(response.clearCookie).toHaveBeenCalledWith('access_token');
    });
  });
});
