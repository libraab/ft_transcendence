import { Controller, Get, HttpException, HttpStatus, Param, ParseArrayPipe, ParseBoolPipe, ParseIntPipe, Post } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Controller('rooms')
export class RoomsController
{
	constructor(private db: DatabaseService) {}

	@Get(':id')
	async getOwnedRooms(@Param('id', ParseIntPipe) id: number)
	{
		return this.db.getRoomsByOwnerId(id);
	}

	@Get('/client/:id')
	async getClientForRoom(@Param('id', ParseIntPipe) id: number)
	{
		//return this.db.
	}

	@Get('/privateRoomMember/:id')
	async getPrivateRoomMembers(@Param('id', ParseIntPipe) id: number)
	{
		return this.db.getMembersForPrivateRoom(id);
	}

	@Get('/allRoomMember/:idRoom/:idMember')
	async getAllRoomMember(@Param('idRoom', ParseIntPipe) idRoom: number,
							@Param('idMember', ParseIntPipe) idMember: number)
	{
		return this.db.getMembersByRoomIdExcludingClient(idRoom, idMember);
	}

	@Get('/allRoomMemberForAdmins/:idRoom/:idMember')
	async getAllRoomMembeForAdmins(@Param('idRoom', ParseIntPipe) idRoom: number,
							@Param('idMember', ParseIntPipe) idMember: number)
	{
		return this.db.getMembersByRoomIdExcludingClientForAdmins(idRoom, idMember);
	}


	@Get('valideRooms/:id')
	async getAuthorizedRoomsForId(@Param('id', ParseIntPipe) id: number)
	{
		return this.db.getRoomsExcludingWhereClientIsMember(id);
	}

	@Get('getAdmins/:roomId')
	async getRoomAdmins(@Param('roomId', ParseIntPipe) roomId: number)
	{
		return this.db.getRoomAdmins(roomId);
	}

	@Get('/replacementList/:id')
	async getReplacements(@Param('id', ParseIntPipe) roomId: number)
	{
		try
		{
			return this.db.getRoomReplacementMembers(roomId);
		}
		catch (error)
		{
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}

	}

	@Post('/join/:roomId/:clientId')
	async joinRoom(@Param('clientId', ParseIntPipe) clientId: number,
					@Param('roomId', ParseIntPipe) roomId: number) {
		const room = await this.db.getRoomById(roomId);
		const client = await this.db.getClientById(clientId);

		console.log(room);
		console.log(client);

		if (!room || !client) {
			throw new HttpException("room id or client id onvalid", HttpStatus.BAD_REQUEST);
		}
		if (await this.db.checkRoomMember(roomId, clientId))
			return HttpStatus.NO_CONTENT;

		if (room.secu === 2) {
			try {
				await this.db.addMemberToRoom(roomId, clientId, 6);
				return HttpStatus.NO_CONTENT;
			}
			catch (error) {
				throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
			}
		}

		if (room.secu === 3) {
			throw new Error('Cannot join a private room');
		}

		await this.db.addMemberToRoom(roomId, clientId, 2);
		return 'User joined the room';
	}

	@Post('updateStatus/:id/:client/:status')
	async updateClientStatus(@Param('id', ParseIntPipe) roomId: number,
							@Param('client', ParseIntPipe) clientId: number,
							@Param('status', ParseIntPipe) status: number)
	{
		try
		{
			await this.db.changeMemberStatus(roomId, clientId, status);
			return HttpStatus.NO_CONTENT;
		}
		catch (error)
		{
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}

	@Post('kick/:roomId/:clientId')
	async kickClient(@Param('roomId', ParseIntPipe) roomId: number,
						@Param('clientId', ParseIntPipe) memberId: number){
		const ownerCheck = await this.db.checkRoomOwner(roomId, memberId);
		if (ownerCheck)
			throw new HttpException("can't kick room owner", HttpStatus.BAD_REQUEST);

		try
		{
			await this.db.removeClientFromRoom(roomId, memberId);
			return HttpStatus.NO_CONTENT;
		}
		catch (error)
		{
			console.log(error);
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}

	@Post('acceptNewMember/:roomId/:clientId')
	async acceptNewMember(@Param('roomId', ParseIntPipe) roomId: number,
							@Param('clientId', ParseIntPipe) memberId: number){
		try
		{
			await this.db.addMemberToRoom(roomId, memberId);
			return HttpStatus.NO_CONTENT;
		}
		catch (error)
		{
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}

	@Post('/delete/:roomId')
	async deleteRoom(@Param('roomId', ParseIntPipe) roomId: number)
	{
		try
		{
			await this.db.deleteRoomWithMembers(roomId);
			return HttpStatus.NO_CONTENT;
		}
		catch(error)
		{
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}

	@Post('/resign/:roomId/:ownerId/:adminId/:stay')
	async resign(@Param('roomId', ParseIntPipe) roomId: number,
				@Param('ownerId', ParseIntPipe) ownerId: number,
				@Param('adminId', ParseIntPipe) adminId: number,
				@Param('stay', ParseBoolPipe) stay: boolean)
	{
		const ownerCheck = await this.db.checkRoomOwner(roomId, ownerId);
		const roomUserCheck = await this.db.checkRoomMember(roomId, adminId);
		if (!ownerCheck || !roomUserCheck)
			throw new HttpException("invalid client for specified room", HttpStatus.BAD_REQUEST);
		if (ownerId === adminId)
			throw new HttpException("you so funny Larry", HttpStatus.BAD_REQUEST);
		
		try
		{
			await this.db.changeMemberStatus(roomId, ownerId, 1); // owner becomes admin |__ > table roomMembers
			await this.db.changeMemberStatus(roomId, adminId, 0); // admin becomes owner |
			await this.db.changeRoomOwner(roomId, adminId); // pass admin as owner in table Rooms

			if (!stay) // is resign is decided with leaving the room
				await this.db.removeClientFromRoom(roomId, ownerId); 

			return HttpStatus.NO_CONTENT;
		}
		catch (error)
		{
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}
}
