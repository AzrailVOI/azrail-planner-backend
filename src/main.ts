import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./cert/key.pem'),
    cert: fs.readFileSync('./cert/cert.pem'),
  };
  const app = await NestFactory.create(AppModule,{
    httpsOptions
  });

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: ['http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['set-cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 204
  })

  app.use(cookieParser());

  await app.listen(4200);
}
bootstrap();
