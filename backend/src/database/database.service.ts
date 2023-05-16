import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientDto } from './dtos/dbBaseDto';
import { ClientStats, ClientToClient, Clients, Prisma, RoomMembers, Rooms } from '@prisma/client';
import { UpdateClientDto } from 'src/dashboard/dashboardDtos/updateClientDto';
import { createRelationsDto, createRoomDto } from 'src/dashboard/dashboardDtos/createsTablesDtos';

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
	
	async getClientByCookie(cookie: string): Promise<Clients | null> {
		const client = await this.prisma.clients.findUnique({
				where: {
				cookie: cookie,
			},
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
	
	async findClientsByName(name: string): Promise<Clients[]> {
		return await this.prisma.clients.findMany({
		  where: {
				name: {
				contains: name,
				},
			},
		});
	}

	async createClient(dto: ClientDto): Promise<Clients>
	{
		try
		{
			const client = await this.prisma.clients.create({
				data:{
					id42: dto.id42,
					name: dto.name,
					cookie: dto.cookie,
					img: dto.img
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
	
	async updateCookie(id: number, data: UpdateClientDto): Promise<Clients>
	{
		try{
			const updateData: Prisma.ClientsUpdateInput = {
				cookie: data.cookie ? { set: data.cookie } : undefined,
			};

			const updatedClient = await this.prisma.clients.update({
				where: { id42: id },
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

	async getClientStatsById(id: number): Promise<ClientStats>
	{
		const clientStats = await this.prisma.clientStats.findUnique({
			where: { id },
			include: { client: true },
		});

	   return clientStats;
	}

	async getTop100Scores(): Promise<ClientStats[]> {
		const top100Scores = await this.prisma.clientStats.findMany({
			orderBy: {
				score: 'asc',
			},
			take: 100,
		});

		return top100Scores;
	}

	async getRelationsByClientId1(clientId1: number): Promise<ClientToClient[]> {
		const values = await this.prisma.clientToClient.findMany({
			where: {
				client1Id: clientId1
			}
		});

		return values;
	}

	async getRoomsByUserId(userId: number): Promise<Rooms[]> {
		return await this.prisma.rooms.findMany({
			where: {
				members: {
					some: {
						id: userId,
					},
				},
			},
		});
	}

	async getLastNMessagesByRoomId(roomId: number, n: number): Promise<[string, string][]> {
		const messages = await this.prisma.messagesRooms.findMany({
			where: {
				roomId,
			},
			orderBy: {
				time: 'desc',
			},
			take: n,
			include: {
				client: true,
			},
		});

		return messages.map((message) => [message.client.name, message.msg]);
	}


	async createRelation(dto: createRelationsDto): Promise<ClientToClient>
	{
		try
		{
			const relation = await this.prisma.clientToClient.create({
				data:{
					client1Id: dto.idClient1,
					status: dto.status,
					client2Id: dto.idClient2
				},
			});

			return relation;
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

	async createRooom(dto: createRoomDto): Promise<Rooms>
	{
		try
		{
			const { name, ownerid, secu } = dto;

			const room = await this.prisma.rooms.create({
				data: {
					name,
					ownerid,
					secu,
				},
			});

			return room;
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

	async getRooms(): Promise<{ id: number; name: string }[]> {
		const rooms = await this.prisma.rooms.findMany({
			where: {
				secu: {
					not: 2,
				},
			},
			select: {
				id: true,
				name: true,
			},
		});

		return rooms;
	}

	async getRoomIdsAndNamesByClientId(clientId: number): Promise<{ roomId: number; roomName: string }[]> {
		const roomMembers = await this.prisma.roomMembers.findMany({
			where: {
				memberId: clientId,
			},
			select: {
				room: {
					select: {
						id: true,
						name: true,
					},
				},
			},
		});

		const roomIdsAndNames = roomMembers.map((roomMember) => ({
			roomId: roomMember.room.id,
			roomName: roomMember.room.name,
		}));

		return roomIdsAndNames;
	}

	async addMemberToRoom(roomId: number, memberId: number, status: number): Promise<RoomMembers> {
		try {
			const roomMember = await this.prisma.roomMembers.create({
				data: {
					roomId,
					memberId,
					status,
				},
			});

			return roomMember;
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

	async getRoomById(roomId: number): Promise<Rooms | null> {
		try
		{
			const room = await this.prisma.rooms.findUnique({
				where: {
					id: roomId,
				},
			});

			return room || null;
		}
		catch (error)
		{
			throw error;
		}
	}

}