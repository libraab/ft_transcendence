import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';

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
