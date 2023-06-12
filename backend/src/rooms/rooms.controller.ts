import { Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
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


	@Post('updateStatus/:id/:client/:status')
	async updateClientStatus(@Param('id', ParseIntPipe) roomId: number,
							@Param('client', ParseIntPipe) clientId: number,
							@Param('status', ParseIntPipe) status: number)
	{
		try
		{
			console.log(roomId, clientId, status);
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
			await this.db.createMember(roomId, memberId);
			return HttpStatus.NO_CONTENT;
		}
		catch (error)
		{
			console.log(error);
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
	}
}
