import { Test, TestingModule } from '@nestjs/testing';
import { LogController } from './log.controller';
import { LogService } from './log.service';
import { QueryLogDto } from './dto/queryLog.dto';

import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { ObjectId } from 'mongodb';

const mockLogs = [
  {
    _id: new ObjectId('6090b1d0e36da7b347849cb6'),
    context: 'test',
    message: 'Test log message 1',
    level: 'SQL',
    createdAt: new Date('2024-05-01T08:30:00Z'),
  },
  {
    _id: new ObjectId('6090b1e5e36da7b347849cb7'),
    context: 'test',
    message: 'Test log message 2',
    level: 'SQL',
    createdAt: new Date('2024-05-02T14:20:00Z'),
  },
];

describe('LogController', () => {
  let controller: LogController;
  let service: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LogController],
      providers: [
        {
          provide: LogService,
          useValue: {
            getLogs: jest.fn().mockResolvedValue(mockLogs),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<LogController>(LogController);
    service = module.get<LogService>(LogService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLogs', () => {
    it('should return an array of logs', async () => {
      const queryLogDto: QueryLogDto = { context: 'SQL' };

      jest.spyOn(service, 'getLogs').mockResolvedValue(mockLogs);

      const result = await controller.getLogs(queryLogDto);

      expect(result).toBe(mockLogs);
    });
  });
});
