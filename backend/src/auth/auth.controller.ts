import { Controller, Query, Get, HttpException, HttpStatus, Res, Header} from '@nestjs/common';
import { AuthService } from './auth.service';
import type User42Interface from './user42.interface';
import { JwtService } from '@nestjs/jwt';
import { FastifyReply } from 'fastify';
import { DatabaseService } from 'src/database/database.service';
import { ClientDto } from 'src/database/dtos/dbBaseDto';
@Controller('auth')
export class AuthController {
	constructor(	private authService: AuthService,
					private jwtService: JwtService,
					private databaseService: DatabaseService) {}
	
	@Get()
	@Header ('Content-Type', 'text/html')
	// https://api.intra.42.fr/apidoc/guides/web_application_flow
	async getAccessToken(	@Query() query: any,
							@Res({ passthrough: true }) response: FastifyReply): Promise<string> {
		const { code } = query;
		const access_token = await this.authService.get_token(code);
		if (access_token == undefined)
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		const user_info: User42Interface = await this.authService.get_user_info(access_token);
		const user = await this.databaseService.getClientById42(user_info.id);
		if (!user) {
			let new_user: ClientDto = new ClientDto;
			new_user.id42 = user_info.id;
			new_user.name = user_info.login;
			await this.databaseService.createClient(new_user);
		}
		// generetate the jwt
		const jwt = await this.jwtService.signAsync({id: user_info.id});
		console.log('jwt -->', jwt);
		response.setCookie('jwt_cookie', jwt);
		// https://docs.nestjs.com/techniques/cookies
		// return ('<script>window.close()</script>');
		return response.redirect(302, 'http://localhost:8080');
		// response is a Fastify Reply object and not an Express Response object that is why we have to redirect redirect with Fastify by giving the status

		return '';
	}
}