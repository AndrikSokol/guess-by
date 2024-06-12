import { Test, TestingModule } from '@nestjs/testing';
import { LogService } from './log.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { LogMongo } from './entities/log.entity';
import { CreateLogDto, levelLog } from './dto/createLog.dto';
import { QueryLogDto } from './dto/queryLog.dto';
import { ObjectId } from 'mongodb';

const mockLogRepository = {
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockLogs = [
  {
    _id: new ObjectId('6090b1d0e36da7b347849cb6'),
    context: 'test',
    message: 'Test log message 1',
    level: 'log',
    createdAt: new Date('2024-05-01T08:30:00Z'),
  },
  {
    _id: new ObjectId('6090b1e5e36da7b347849cb7'),
    context: 'test',
    message: 'Test log message 2',
    level: 'error',
    createdAt: new Date('2024-05-02T14:20:00Z'),
  },
];

const mockCreateLogDto: CreateLogDto = {
  message: 'Test log message',
  context: 'test',
  level: levelLog.Log,
};

const mockNewLog: LogMongo = {
  _id: new ObjectId('6090b1d0e36da7b347849cb6'),
  context: 'test',
  message: 'Test log message',
  level: 'log',
  createdAt: new Date('2024-05-03T12:00:00Z'),
};

describe('LogService', () => {
  let service: LogService;
  let logRepository: Repository<LogMongo>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogService,
        {
          provide: getRepositoryToken(LogMongo, 'mongoConnection'),
          useValue: mockLogRepository,
        },
      ],
    }).compile();

    service = module.get<LogService>(LogService);
    logRepository = module.get<Repository<LogMongo>>(
      getRepositoryToken(LogMongo, 'mongoConnection'),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getLogs', () => {
    it('should return logs based on the context', async () => {
      const query: QueryLogDto = {
        context: 'test',
      };

      mockLogRepository.find.mockResolvedValue(mockLogs);

      const result = await service.getLogs(query);

      expect(mockLogRepository.find).toHaveBeenCalledWith({
        where: { context: query.context },
      });
      expect(result).toEqual(mockLogs);
    });
  });

  describe('createLog', () => {
    it('should create a log', async () => {
      mockLogRepository.create.mockReturnValue(mockNewLog);

      const result = await service.createLog(mockCreateLogDto);

      expect(mockLogRepository.create).toHaveBeenCalledWith(mockCreateLogDto);
      expect(mockLogRepository.save).toHaveBeenCalledWith(mockNewLog, {
        data: { isCreatingLogs: true },
      });
      expect(result).toEqual(mockNewLog);
    });
  });
});
