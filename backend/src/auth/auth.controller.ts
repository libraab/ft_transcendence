import { Controller, Post, Body } from '@nestjs/common';
import axios from 'axios';

@Controller('auth')
export class AuthController {
  @Post('token')
  async getAccessToken(@Body() body: { code: string }): Promise<{ access_token: string }> {
    const { code } = body;
    const response = await axios.post('https://example.com/oauth2/token', {
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'http://localhost:3000/auth/callback',
      client_id: 'CLIENT_ID',
      client_secret: 'CLIENT_SECRET',
    });

    return { access_token: response.data.access_token };
  }
}
