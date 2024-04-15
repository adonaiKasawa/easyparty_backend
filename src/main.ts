import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cors({
      origin: [
        'http://localhost:3000',
      ],
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('/easyparty/api');

  const configSwagger = new DocumentBuilder()
    .setTitle('EasyParty')
    .setDescription('API')
    .setVersion('1.0')
    .addTag('All Route For App')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('/easyparty/api/docs', app, document);

  await app.listen(4500);
}
bootstrap();
