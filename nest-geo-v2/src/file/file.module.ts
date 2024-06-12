import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { path as appPath } from 'app-root-path';
import * as path from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(appPath, 'uploads'),
      serveRoot: '/static',
      exclude: ['/api/(.*)'],
    }),
  ],
  controllers: [FileController],
  providers: [{ useClass: FileService, provide: 'FILE_SERVICE' }],
  exports: [{ useClass: FileService, provide: 'FILE_SERVICE' }],
})
export class FileModule {}
