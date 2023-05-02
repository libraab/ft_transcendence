import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientDto, UpdateClientDto } from './dtos/dbBaseDto';
import { Clients, Prisma } from '@prisma/client';

@Injectable()
export class DatabaseService
{
	constructor(private prisma: PrismaService) {}

	async getClientById42(id42: number): Promise <Clients | null>
	{
		const client = await this.prisma.clients.findUnique({
			where:{
				id42: id42,
			}
		});

		return client || null;
	}

	async getClientById(id: number): Promise<Clients | null>
	{
		const client = await this.prisma.clients.findUnique({
			where:{
				id: id,
			}
		});

		return client || null;
	}
	
	async getClientIdFromId42(id42: number): Promise<number | null>
	{
		const client = await this.prisma.clients.findUnique({
			select: { id: true },
			where: { id42: id42 },
		});
		
		return client?.id || null;
	}
	
	async getClientId42FromId(id: number): Promise<number | null>
	{
		const client = await this.prisma.clients.findUnique({
			select: { id42: true },
			where: { id: id },
		});
		
		return client?.id42 || null;
	}
	
	async createClient(dto: ClientDto): Promise<Clients>
	{
		try
		{
			const client = await this.prisma.clients.create({
				data:{
					id42: dto.id42,
					name: dto.name
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

	async updateClient(id: number, data: UpdateClientDto): Promise<Clients>
	{
		try{
			const updateData: Prisma.ClientsUpdateInput = {
				img: data.img ? { set: data.img } : undefined,
				name: data.name ? { set: data.name } : undefined,
			};

			const updatedClient = await this.prisma.clients.update({
				where: { id },
				data: updateData,
			});
			
			return updatedClient;
		}
		catch (error)
		{
			if (error instanceof Prisma.PrismaClientKnownRequestError)
			{
				if (error.code === 'P2025') {
					throw new NotFoundException('User doesn\'t exist');
				}
				if (error.code === 'P2002') {
					throw new ForbiddenException('Credentials taken');
				}
				throw error;
			}

		}
	}
}
