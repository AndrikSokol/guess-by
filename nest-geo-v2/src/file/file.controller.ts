import {
  Body,
  Controller,
  FileTypeValidator,
  Inject,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileService } from './file.service';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { FileDto } from './dto/file.dto';
import { MFile } from './dto/mFile.dto';
import { UploadByUrlDto } from './dto/uploadByUrl.dto';

@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(
    @Inject('FILE_SERVICE') private readonly fileService: FileService,
  ) {}

  @ApiOperation({ summary: 'upload from storage' })
  @ApiCookieAuth('access_token')
  @ApiBody({ type: FileDto })
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload')
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image/jpeg' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const buffer = await this.fileService.convertToWebp(file.buffer);

    const webpFile = new MFile({
      originalname: `${file.originalname.split('.')[0]}.webp`,
      buffer,
    });

    return await this.fileService.saveFile([file, webpFile]);
  }

  @ApiOperation({ summary: 'upload by link' })
  @ApiCookieAuth('access_token')
  @ApiBody({ type: UploadByUrlDto })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('upload-by-link')
  async uploadByLinkFile(@Body() uploadByUrlDto: UploadByUrlDto) {
    return await this.fileService.saveFileByLink(uploadByUrlDto.url);
  }
}
