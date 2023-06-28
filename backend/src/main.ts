import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import fastifyCookie from '@fastify/cookie';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AuthGuard } from './auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ValidationPipe } from '@nestjs/common';
import cors from 'cors';
import fastifyMultipart from '@fastify/multipart'
import { Logger } from '@nestjs/common';


require('dotenv').config()

async function bootstrap() {
  const logger = new Logger('Application');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.register(fastifyCookie, {
    secret: 'my-secret', // for cookies signature
  });
  app.register(fastifyMultipart);

  const jwtService = app.get<JwtService>(JwtService); // Get the JwtService instance

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: "http://"+process.env.HOSTNAME+":8080",
    credentials: true
  });
  app.use(cors({origin: "http://"+process.env.HOSTNAME+":8080"}));

  await app.listen(3000, '0.0.0.0', () => {
    logger.log("L'application est en cours d'écoute sur le port 3000"); // Utilisez le logger pour enregistrer un message de log
  });
}

bootstrap();
