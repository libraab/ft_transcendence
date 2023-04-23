import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientDto } from './dtos/dbBaseDto';
import { Clients, Prisma } from '@prisma/client';

@Injectable()
export class DatabaseService
{
	constructor(private prisma: PrismaService) {}

	async getClientById42(id42: number)
	{
		const client = await this.prisma.clients.findUnique({
			where:{
				id42: id42,
			}
		});

		return client;
	}
	
	async getClientById(id: number)
	{
		const client = await this.prisma.clients.findUnique({
			where:{
				id: id,
			}
		});

		return client;
	}

	async createClient(dto: ClientDto): Promise<Clients>
	{
		try
		{
			console.log(dto.name);
			const client = await this.prisma.clients.create({
				data:{
					id42: dto.id42,
					name: dto.name,
					pseudo: dto.pseudo,
					email: dto.email,
					num: dto.num,
					cookie: dto.cookie,
				},
			});

			return client;
		}
		catch (error)
		{
			if (error instanceof Prisma.PrismaClientKnownRequestError)
			{
				if (error.code === 'P2002') {
					throw new ForbiddenException('Credentials taken');
				}
			}
			throw error;
		}
	}
}
