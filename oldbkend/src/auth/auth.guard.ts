import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';

// https://docs.nestjs.com/guards
// guards can be controller-scoped, method-scoped, or global-scoped
// to use the guard : @UseGuards(MyGuard)

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

	canActivate(context: ExecutionContext): boolean {
		const req: FastifyRequest = context.switchToHttp().getRequest();
		const jwt: string = req.cookies['jwt_cookie'];
		try {
			const decoded = this.jwtService.verify(jwt);
            console.log('yummy, good cookie');
			return true; // Return true to allow access
		} catch (err) {
            console.log('beurk, bad cookie');
			return false; // Return false to deny access
		}
	}
}
