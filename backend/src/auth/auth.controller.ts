import { Controller, Post, Body, Query, Get} from '@nestjs/common';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  @Get()
  async getAccessToken(@Query() query: any[]): Promise<string> {
    // const { code } = query;
    // const response = await axios.post('https://example.com/oauth2/token', {
    //   grant_type: 'authorization_code',
    //   code,
    //   redirect_uri: 'http://localhost:3000/auth/callback',
    //   client_id: 'CLIENT_ID',
    //   client_secret: 'CLIENT_SECRET',
    // });

    return ("Hello Asma!");
  }
}
