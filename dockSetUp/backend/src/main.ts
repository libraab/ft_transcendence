import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Application');
  const app = await NestFactory.create(AppModule);

  app.use(cors({
    origin: 'http://frontend:8080',
    credentials: true,
  }));

  //console.log(process.env.TEST_BCK);
  await app.listen(3000, '0.0.0.0', () => {
    logger.log("L'application est en cours d'écoute sur le port 3000");
  });
}

bootstrap();
