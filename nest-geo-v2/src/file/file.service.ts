import { BadRequestException, Injectable } from '@nestjs/common';
import { path as appPath } from 'app-root-path';
import { format } from 'date-fns';
import { ensureDir, writeFile } from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';
import * as path from 'path';
import { FileElementResponse } from './types/fileElementResponse.type';
import { MFile } from './dto/mFile.dto';
import * as imageDownloader from 'image-downloader';
import { INVALID_URL } from '@/constants/response-messages';

@Injectable()
export class FileService {
  private format = 'yyyy-MM-dd';

  async saveFile(files: MFile[]): Promise<FileElementResponse[]> {
    const dateFolder = format(new Date(), this.format);

    const uploadFolder = path.join(appPath, 'uploads', dateFolder);

    await ensureDir(uploadFolder);

    const res: FileElementResponse[] = [];
    for (const file of files) {
      const filePart = file.originalname.split('.');

      const filename = `${filePart[0]}-${uuidv4()}.${filePart[1]}`;

      await writeFile(`${uploadFolder}/${filename}`, file.buffer);
      res.push({
        url: `${dateFolder}/${filename}`,
        name: filename,
      });
    }

    return res;
  }

  async saveFileByLink(url: string): Promise<FileElementResponse> {
    const dateFolder = format(new Date(), this.format);

    const uploadFolder = path.join(appPath, 'uploads', dateFolder);

    await ensureDir(uploadFolder);

    try {
      const { filename } = await imageDownloader.image({
        url,
        dest: uploadFolder,
      });

      const name = path.basename(filename);

      return { url: `${dateFolder}/${name}`, name: name };
    } catch (error) {
      throw new BadRequestException(INVALID_URL);
    }
  }

  convertToWebp(file: Buffer): Promise<Buffer> {
    return sharp(file).webp().toBuffer();
  }
}
