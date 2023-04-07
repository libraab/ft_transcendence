import { Controller, Post, Body, Query, Get} from '@nestjs/common';
import axios from 'axios';

@Controller('auth')
export class AuthController {
@Get()
// https://api.intra.42.fr/apidoc/guides/web_application_flow
async getAccessToken(@Query() query: any): Promise<void> {
	const { code } = query;
	const data = {
		grant_type: 'authorization_code',
		code,
		client_id: process.env.CLIENT_ID,
		client_secret: process.env.CLIENT_SECRET,
		redirect_uri: 'http://localhost:3000/auth',
	}
	const response = axios.post('https://api.intra.42.fr/oauth/token', data);
	response
		.then((res:any) => {
			console.log("ok");
			console.log(res.data.access_token);
		})
		.catch((err: any) => {
			console.log("pas content");
		})
  }
}