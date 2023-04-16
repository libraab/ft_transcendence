import { Controller, Query, Get, HttpException, HttpStatus, Res} from '@nestjs/common';
import { AuthService } from './auth.service';
import type User42Interface from './user42.interface';
import { JwtService } from '@nestjs/jwt';
import { FastifyReply } from 'fastify';

@Controller('auth')
export class AuthController {
	constructor(	private authService: AuthService,
					private jwtService: JwtService) {}
	
	@Get()
	// https://api.intra.42.fr/apidoc/guides/web_application_flow
	async getAccessToken(	@Query() query: any,
							@Res({ passthrough: true }) response: FastifyReply): Promise<void> {
		const { code } = query;
		const access_token = await this.authService.get_token(code);
		if (access_token == undefined)
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		const user_info: User42Interface = await this.authService.get_user_info(access_token);
		console.log('id user --> ', user_info.id);
		console.log('login -->', user_info.login);
		// TODO
		// check if user already exist 
		// create user if new user
		// load the user if already exist
		//------------------------------------------------------
		// generetate the jwt
		// npm install --save @nestjs/jwt
		const jwt = await this.jwtService.signAsync({id: user_info.id});
		console.log('jwt -->', jwt);
		// console.log('jwt --> ' + jwt);
		// console.log(`jwt --> ${jwt}`);
		//------------------------------------------------------
		// putting jwt in a cookie
		// https://docs.nestjs.com/techniques/cookies
		// npm i @fastify/cookie
		// @nestjs/platform-fastify
		response.setCookie('jwt_cookie', jwt);
		// TODO
		// faire le guard (autre fichiers)
		// https://docs.nestjs.com/guards
	}
}