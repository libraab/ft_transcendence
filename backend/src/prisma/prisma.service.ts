import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient
{
	constructor()
	{
		super({
			datasources:{
				db:{
					url: "postgresql://postgres:123@localhost:5000/ft_transcendence?schema=public",
				}
			}
		})
	}
}
