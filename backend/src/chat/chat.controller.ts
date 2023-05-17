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
        return this.db.getRoomIdsAndNamesByClientId(id); // <-- useless
    }

    @Get('/messages/:id')
    async getAllMessages(@Param('id', ParseIntPipe) id: number)
    {
		let json = await this.db.getRoomMessagesById(id);
        let res = [];
        await Promise.all(json.map(async (e) => {
            res.push({ sender: e.clientName, message: e.message});
        }));
        console.log(res);
		return res;
    }

    @Delete()
    quitRoom(): string
    {
        return 'user quit the room';
    }

    @Post()
    async createNewRoom(@Body() data) {
        const existingRooms = await this.db.getRooms();
        const roomNames = existingRooms.map((room) => room.name);

        if (roomNames.includes(data.roomName)) {
            throw new Error('Room name already exists');
        }
        this.dto.name = data.roomName;
        this.dto.ownerid = data.iddata;
        if (data.roomType == "public")
            this.dto.secu = 0;
        if (data.roomType == "protected")
            this.dto.secu = 1;
        if (data.roomType == "private")
            this.dto.secu = 2;

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

    @Post('/join')
    async joinRoom(@Body() data) {
    const room = await this.db.getRoomById(data.roomId);
    const client = await this.db.getClientById(data.clientId);

    if (!room) {
        throw new Error('Room does not exist');
    }

    if (room.secu === 2) {
        throw new Error('Cannot join a private room');
    }

    if (room.secu === 1) {
        console.log('This room is protected, password required');
    }

    await this.db.addMemberToRoom(data.roomId, data.clientId, 2);
    return 'User joined the room';
  }
}