import {
  Controller,
  Query,
  Get,
  HttpException,
  HttpStatus,
  Res,
  Header,
  Body,
  Post,
  Param,
  ParseIntPipe,
  Request,
  Redirect,
  BadRequestException,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type User42Interface from './user42.interface';
import { JwtService } from '@nestjs/jwt';
import { FastifyReply } from 'fastify';
import { DatabaseService } from 'src/database/database.service';
import { ClientDto } from 'src/database/dtos/dbBaseDto';
import { UpdateClientDto } from 'src/dashboard/dashboardDtos/updateClientDto';
import { authenticator } from 'otplib';
import { qrcode } from 'qrcode';
import { AuthGuard } from './auth.guard';
import IJWT from 'src/interfaces/jwt.interface';
import { NotFoundError } from 'rxjs';
const qrcode = require('qrcode');

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private databaseService: DatabaseService,
  ) {}

  @Get()
  @Header('Content-Type', 'text/html')
  // https://api.intra.42.fr/apidoc/guides/web_application_flow
  async getAccessToken(
    @Query() query: any,
    @Res({ passthrough: true }) response: FastifyReply,
  ) {
    const { code } = query;
    const access_token = await this.authService.get_token(code);
    if (access_token == undefined)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    const user_info: User42Interface = await this.authService.get_user_info(
      access_token,
    );
    let user = await this.databaseService.getClientById42(user_info.id);
    if (!user) {
      const new_user: ClientDto = new ClientDto();
      new_user.id42 = user_info.id;
      new_user.name = user_info.login;
      new_user.cookie = 'ABC';
      new_user.img = user_info.image.link;
      user = await this.databaseService.createClient(new_user);
    } else console.log('We already know this person');

    const add_cookie: UpdateClientDto = new UpdateClientDto();
    // generetate the jwt
    const jwt = await this.jwtService.signAsync({ id: user_info.id });
    response.setCookie('jwt_cookie', jwt, { path: '/' });
    response.setCookie('id42', user.id42.toString(), { path: '/' });
    // return response;

    // add_cookie.cookie = jwt;
    // await this.databaseService.updateCookie(user.id42, add_cookie); // not good
    // https://docs.nestjs.com/techniques/cookies

    // response.redirect('/');
    return '<script>document.location.href="/"</script>';

    // response is a Fastify Reply object and not an Express Response object that is why we have to redirect redirect with Fastify by giving the status
  }

  @UseGuards(AuthGuard)
  @Post('/2fa/verify')
  async verifyTwoFactorAuthCode(
    @Request() req: { user: IJWT },
    @Body('code') code: string,
  ) {
    const user = await this.databaseService.getClientById42(req.user.id);
    if (user == null)
      throw new NotFoundException("user doesnt exist");
    const isVerified = authenticator.check(code, user.DfaSecret);
    const userDto: UpdateClientDto = new UpdateClientDto();
    console.log("code received -->" + code);
    console.log("code is -->" + isVerified);
    if (isVerified) {
      userDto.dfaVerified = true;
      await this.databaseService.updateClient(user.id, userDto);
      return {
        message: '2Fa is valide',
      };
    }
    return new BadRequestException('Error check 2FA');
  }

  @UseGuards(AuthGuard)
  @Get('/2fa')
  async DfaIsActive(
    @Request() req: { user: IJWT },
  ) {
    const user = await this.databaseService.getClientById42(req.user.id);
    if (!user)
      throw new NotFoundException("user doesnt exist");
    return {dfa: user.Dfa, dfaVerifies: user.dfaVerified};
  }

  @Post('/2fa/:id')
  async activateDfa(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { isDFAActive: boolean },
  ): Promise<{ qrCodeImageUrl?: string }> {
    const { isDFAActive } = body;
    const user: UpdateClientDto = new UpdateClientDto();
    // if user activate the dfa
    if (isDFAActive) {
      user.dfa = true;
      user.dfaVerified = false;
      user.dfaSecret = authenticator.generateSecret(); // Generate a new secret key
      await this.databaseService.updateClient(id, user);
      // Generate the QR code image
      const otpauthUrl = authenticator.keyuri(
        'asmabouhlel@student.42nice.fr',
        'ft_transcendence',
        user.dfaSecret,
        );
        const qrCodeImageUrl = await qrcode.toDataURL(otpauthUrl);
        return { qrCodeImageUrl };
      } else {
        user.dfa = false;
        await this.databaseService.updateClient(id, user);
      }
      return {};
    }
  }
