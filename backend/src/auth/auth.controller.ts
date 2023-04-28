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
		//------------------------------------------------------
		const user = await this.authService.getClientIdFromId42(user_info.id); // change authservice with the right one 
		if (!user)
			await this.authService.createClient(user_info);
		else 
			await this.authService.loadUser(user);
		//------------------------------------------------------
		// generetate the jwt
		const jwt = await this.jwtService.signAsync({id: user_info.id});
		console.log('jwt -->', jwt);
		//------------------------------------------------------
		// https://docs.nestjs.com/techniques/cookies
		// putting jwt in a cookie
		response.setCookie('jwt_cookie', jwt);
		response.send(`
		<h1>Authentication successful</h1>
		<script>
			setTimeout(() => window.close(), 100);
		</script>
	`);
	}
}