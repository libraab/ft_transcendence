import { Controller, Query, Get, HttpException, HttpStatus} from '@nestjs/common';
import { AuthService } from './auth.service';
import type User42Interface from './user42.interface';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}
	@Get()
	// https://api.intra.42.fr/apidoc/guides/web_application_flow
	async getAccessToken(@Query() query: any): Promise<void> {
		const { code } = query;
		const access_token = await this.authService.get_token(code);
		if (access_token == undefined)
			throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
		const user_info: User42Interface = await this.authService.get_user_info(access_token);
		console.log(user_info.id);
		console.log(user_info.login);
		
		// check if user already exist 
		// create user if new user
		// load the user if already exist
		// generetate the jwt 
	}
}