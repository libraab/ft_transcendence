import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('chat')
export class ChatController {

    @Get()
    getAllUsersChat(): string
    {
        return 'returning all chat of user';
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
