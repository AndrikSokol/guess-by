import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import getLogLevels from './utils/getLogLevels';
import CustomLogger from './log/customLogger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
    bufferLogs: true,
  });
  app.enableCors({
    origin: ['http://localhost:3001'],
    credentials: true,
  });

  app.useLogger(app.get(CustomLogger));
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Final project')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
