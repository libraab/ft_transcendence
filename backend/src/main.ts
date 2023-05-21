import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import fastifyCookie from '@fastify/cookie';
// import fastifyCors from 'fastify-cors';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AuthGuard } from './auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ValidationPipe } from '@nestjs/common';
import cors from 'cors';


require('dotenv').config()

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(fastifyCookie, {
    secret: 'my-secret', // for cookies signature
  });

  const jwtService = app.get<JwtService>(JwtService); // Get the JwtService instance

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: "http://"+process.env.HOSTNAME+":8080",
    credentials: true
  });
  app.use(cors({origin: "http://"+process.env.HOSTNAME+":8080"}));

  await app.listen(3000, '0.0.0.0');
}

bootstrap();
