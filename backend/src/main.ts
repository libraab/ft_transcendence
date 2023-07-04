import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AuthGuard } from './auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ValidationPipe } from '@nestjs/common';
import cors from 'cors';
import fastifyMultipart from '@fastify/multipart';
import { Logger } from '@nestjs/common';
<<<<<<< HEAD
//import { Room, Server } from "colyseus";
//import { MyRoom } from "./pong/MyRoom";
=======
import { Room, Server } from "colyseus";
import { MyRoom } from "./pong/MyRoom";
>>>>>>> 28f4e1c... fastify
import fastifyCookie from '@fastify/cookie';

require('dotenv').config()

async function bootstrap() {
  const logger = new Logger('Application');
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.setGlobalPrefix('api');

  // Récupérer l'instance Fastify
  const fastifyInstance = app.getHttpAdapter().getInstance();

  // Register plugins avec línstance Fastify 
  fastifyInstance.register(fastifyCookie, {
    secret: 'my-secret', // cryptage cookies
  });
  fastifyInstance.register(fastifyMultipart);

  const jwtService = app.get<JwtService>(JwtService); // Récupérer l'instance JwtService

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: "http://"+process.env.HOSTNAME+":8080",
    credentials: true
  });
  app.use(cors({origin: "http://"+process.env.HOSTNAME+":8080"}));

<<<<<<< HEAD
 /* const gameServer = new Server();

  gameServer.define("my_room", MyRoom);
  gameServer.listen(3001);
*/
=======
  const gameServer = new Server();

  gameServer.define("my_room", MyRoom);
  gameServer.listen(3001);

>>>>>>> 28f4e1c... fastify
  await app.listen(3000, '0.0.0.0', () => {
    logger.log("L'application est en cours d'écoute sur le port 3000"); // Utilisez le logger pour enregistrer un message de log
  });
}

bootstrap();
