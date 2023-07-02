import { Controller, Query, Get, HttpException, HttpStatus, Res, Header, Body, Post, Param, ParseIntPipe, Request, Redirect, BadRequestException} from '@nestjs/common';
import { AuthService } from './auth.service';
import type User42Interface from './user42.interface';
import { JwtService } from '@nestjs/jwt';
import { FastifyReply } from 'fastify';
import { DatabaseService } from 'src/database/database.service';
import { ClientDto } from 'src/database/dtos/dbBaseDto';
import { UpdateClientDto } from 'src/dashboard/dashboardDtos/updateClientDto';
import { authenticator } from 'otplib';
import { qrcode } from "qrcode";
const qrcode = require("qrcode");

@Controller('auth')
export class AuthController {
	constructor(	private authService: AuthService,
					private jwtService: JwtService,
					private databaseService: DatabaseService) {}
	
	@Get()
	@Header ('Content-Type', 'application/json')
	// https://api.intra.42.fr/apidoc/guides/web_application_flow
	async getAccessToken(	@Query() query: any,
							@Res({ passthrough: true }) response: FastifyReply): Promise<string> {
		
		const { code } = query;
		const access_token = await this.authService.get_token(code);
		if (access_token == undefined)
		{
			throw new HttpException('Forbidden access token', HttpStatus.FORBIDDEN);
		}
		const user_info: User42Interface = await this.authService.get_user_info(access_token);
		let user = await this.databaseService.getClientById42(user_info.id);
		if (!user) {
			console.log('New user is being created');
			let new_user: ClientDto = new ClientDto;
			new_user.id42 = user_info.id;
			new_user.name = user_info.login;
			new_user.cookie = "ABC";
			new_user.img = user_info.image.link;
			user = await this.databaseService.createClient(new_user);
		}
		else 
			console.log('We already know this person');

		let add_cookie: UpdateClientDto = new UpdateClientDto;
		// generetate the jwt
		let jwt = await this.jwtService.signAsync({id: user_info.id});
		response.setCookie('jwt_cookie', jwt);
		response.setCookie('id42', user.id42.toString());
		
		add_cookie.cookie = jwt;
		await this.databaseService.updateCookie(user.id42, add_cookie); // not good
		// https://docs.nestjs.com/techniques/cookies

		return response.redirect(302, "http://"+process.env.HOSTNAME+":8080");
		// response is a Fastify Reply object and not an Express Response object that is why we have to redirect redirect with Fastify by giving the status
	}

	@Post('2fa/verify/:id')
	async verifyTwoFactorAuthCode(
		@Param('id', ParseIntPipe) id: number,
		@Body('code') code: string,
	)
	{
		console.log(code);
		const user = await this.databaseService.getClientById(id);
		console.log(user);
		const isVerified = authenticator.check(code, user.DfaSecret);
		console.log(isVerified);
		let userDto: UpdateClientDto = new UpdateClientDto;
		if (isVerified) {
			// userDto.dfa = false;
			// await this.databaseService.updateClient(user.id, userDto);
			return {
				message: "2Fa is valide"
			}
		}
		return new BadRequestException('Error check 2FA');
	}
	
	@Post('/2fa/:id')
	async activateDfa(
		@Param('id', ParseIntPipe) id: number,
		@Body() body: { Dfa: boolean }): Promise<{ qrCodeImageUrl?: string }>
	{
		const { Dfa } = body;
		let user: UpdateClientDto = new UpdateClientDto;
		console.log('DFA is ', Dfa);
		// if user activate the dfa
		if (Dfa) {
			console.log('dfa is now activated in database');
			user.dfa = true;
			user.dfaSecret = authenticator.generateSecret(); // Generate a new secret key
			console.log(user.dfaSecret);
			await this.databaseService.updateClient(id, user);
			// Generate the QR code image
			const otpauthUrl = authenticator.keyuri('asmabouhlel@student.42nice.fr', 'ft_transcendence', user.dfaSecret);
			const qrCodeImageUrl = await qrcode.toDataURL(otpauthUrl);
			return { qrCodeImageUrl };
		}
		else {
			user.dfa = false;
			await this.databaseService.updateClient(id, user);
			console.log('dfa is deactivatedin database');
		}
		return {};
	}
}


