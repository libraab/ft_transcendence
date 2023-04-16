import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
@Module({
  //https://docs.nestjs.com/security/authentication
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
