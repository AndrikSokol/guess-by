import { FileService } from './file.service';
import { BadRequestException } from '@nestjs/common';
import { format } from 'date-fns';

// Mock dependencies
jest.mock('fs-extra', () => ({
  ensureDir: jest.fn(),
  writeFile: jest.fn(),
}));

jest.mock('sharp', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    webp: jest.fn().mockReturnThis(),
    toBuffer: jest.fn(),
  })),
}));

jest.mock('image-downloader', () => ({
  image: jest.fn().mockResolvedValue({ filename: '/path/to/image.jpg' }),
}));

describe('FileService', () => {
  let fileService: FileService;

  beforeEach(() => {
    fileService = new FileService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save files and return file element responses', async () => {
    const files = [
      { originalname: 'image.jpg', buffer: Buffer.from('file content') },
    ];
    const expectedDateFolder = format(new Date(), 'yyyy-MM-dd');
    const result = await fileService.saveFile(files);

    const generatedNameWithUUID = result[0].name.split('.')[0];

    expect(result).toEqual([
      {
        url: `${expectedDateFolder}/${generatedNameWithUUID}.jpg`,
        name: `${generatedNameWithUUID}.jpg`,
      },
    ]);
  });

  describe('saveFileByLink', () => {
    it('should save file from link and return file element response', async () => {
      const url = 'https://example.com/image.jpg';
      const expectedDateFolder = format(new Date(), 'yyyy-MM-dd');

      const result = await fileService.saveFileByLink(url);

      expect(result).toEqual({
        url: `${expectedDateFolder}/image.jpg`,
        name: 'image.jpg',
      });
    });
  });
});
