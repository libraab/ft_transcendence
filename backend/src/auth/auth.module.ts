import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth.constants';
import { AuthGuard } from './auth.guard';
@Module({
  //https://docs.nestjs.com/security/authentication
/*  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret
    }),
  ],
  providers: [AuthService, AuthGuard]
})
export class AuthModule {}
