import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import fastifyCookie from '@fastify/cookie';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AuthGuard } from './auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

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

  await app.listen(3000);
}

bootstrap();
