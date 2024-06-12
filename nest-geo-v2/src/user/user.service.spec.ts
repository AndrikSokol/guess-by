import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterAuthDto } from '@/auth/dto/register-auth.dto';

const mockUser: User = new User({
  id: 1,
  firstName: 'andrei',
  lastName: 'sokol',
  email: 'test@example.com',
  passwordHash: 'password',
});

const registerDto: RegisterAuthDto = {
  firstName: 'andrei',
  lastName: 'sokol',
  email: 'test@example.com',
  password: 'password',
};

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await service.create(registerDto);

      expect(result).toEqual(mockUser);
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

      const email = 'test@example.com';
      const result = await service.findByEmail(email);

      expect(result).toEqual(mockUser);
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);

      const id = 1;
      const result = await service.findById(id);

      expect(result).toEqual(mockUser);
    });
  });

  describe('save', () => {
    it('should save user', async () => {
      jest.spyOn(userRepository, 'save').mockResolvedValue(mockUser);

      const result = await service.save(mockUser);

      expect(result).toEqual(mockUser);
    });
  });
});
