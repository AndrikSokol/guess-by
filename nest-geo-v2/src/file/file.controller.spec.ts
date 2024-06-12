import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileElementResponse } from './types/fileElementResponse.type';
import { Readable } from 'stream';

describe('FileController', () => {
  let controller: FileController;
  let fileService: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [
        {
          provide: 'FILE_SERVICE',
          useClass: FileService,
        },
      ],
    }).compile();

    controller = module.get<FileController>(FileController);
    fileService = module.get<FileService>('FILE_SERVICE');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadFile', () => {
    it('should upload a file', async () => {
      const mockFileBuffer = Buffer.from('file content');
      const mockFile: Express.Multer.File = {
        fieldname: 'file',
        originalname: 'image.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: mockFileBuffer.length,
        buffer: mockFileBuffer,
        stream: new Readable(),
        destination: '',
        filename: '',
        path: '',
      };

      jest
        .spyOn(fileService, 'convertToWebp')
        .mockResolvedValueOnce(mockFileBuffer);
      jest
        .spyOn(fileService, 'saveFile')
        .mockResolvedValueOnce([{ url: 'mock-url', name: 'mock-name' }]);

      const result = await controller.uploadFile(mockFile);

      expect(fileService.convertToWebp).toHaveBeenCalledWith(mockFileBuffer);
      expect(fileService.saveFile).toHaveBeenCalledWith(expect.any(Array));
      expect(result).toEqual([
        { url: 'mock-url', name: 'mock-name' },
      ] as FileElementResponse[]);
    });
  });

  describe('uploadByLinkFile', () => {
    it('should upload a file by link', async () => {
      const mockUrl = 'https://example.com/image.jpg';
      const mockFileResponse = {
        url: 'mock-url',
        name: 'mock-name',
      } as FileElementResponse;

      jest
        .spyOn(fileService, 'saveFileByLink')
        .mockResolvedValueOnce(mockFileResponse);

      const result = await controller.uploadByLinkFile({ url: mockUrl });

      expect(fileService.saveFileByLink).toHaveBeenCalledWith(mockUrl);
      expect(result).toEqual(mockFileResponse);
    });
  });
});
