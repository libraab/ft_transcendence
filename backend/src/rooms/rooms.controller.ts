import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
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
}
