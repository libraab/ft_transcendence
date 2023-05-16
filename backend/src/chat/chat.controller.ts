import { Controller, Delete, Get, Post, ParseIntPipe, Put, Param, Body } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import {createRoomDto} from '../dashboard/dashboardDtos/createsTablesDtos'
@Controller('chat')
export class ChatController {
	constructor(private db: DatabaseService,
                private dto: createRoomDto) {}

    @Get(':id')
    async getAllUsersChat(@Param('id', ParseIntPipe) id: number)
    {
		let client = await this.db.getClientById42(id);
		let json = await this.db.getRoomIdsAndNamesByClientId(client.id);
		return json;
        return this.db.getRoomIdsAndNamesByClientId(id);
    }

    @Delete()
    quitRoom(): string
    {
        return 'user quit the room';
    }

    @Post()
    async createNewRoom(@Body() data) {
        this.dto.name = data.roomName;
        this.dto.ownerid = data.iddata;
        if (data.roomType == "public")
            this.dto.secu = 0;
        if (data.roomType == "protected")
            this.dto.secu = 1;
        if (data.roomType == "private")
            this.dto.secu = 2;
        console.log(this.dto.name);
        console.log(this.dto.ownerid);
        console.log(this.dto.secu);

        let Room = await this.db.createRooom(this.dto);
		this.db.addMemberToRoom(Room.id, this.dto.ownerid, 0);
    }
	/*
	0 - owner
	1 - admin
	2 - member
	3 - muted
	4 - kicked
	5 - banned
	*/

    @Get()
    async getRooms(): Promise<{ id: number; name: string }[]> {
        return this.db.getRooms();
    }
}