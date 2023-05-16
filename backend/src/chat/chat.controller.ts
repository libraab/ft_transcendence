import { Controller, Delete, Get, Post, ParseIntPipe, Put, Param } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Controller('chat')
export class ChatController {
	constructor(private db: DatabaseService) {}

    @Get(':id')
    async getAllUsersChat(@Param('id', ParseIntPipe) id: number)
    {
        return this.db.getRoomIdsAndNamesByClientId(id);
    }

    @Delete()
    quitRoom(): string
    {
        return 'user quit the room';
    }

    @Post()
    createNewRoom(): string
    {
        return 'user created a new room';
    }

}