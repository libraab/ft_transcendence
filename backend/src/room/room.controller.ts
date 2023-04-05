import { Controller, Get, Post, Put } from '@nestjs/common';

@Controller('room')
export class RoomController {

    @Get()
    getRoom(): string
    {
        return 'returning room messages'
    }

    @Post()
    sendMessage(): string
    {
        return 'user is sending a message';
    }
  
    @Put()
    correctMessage(): string
    {
        return 'user is correcting a message';
    }
    
    @Put()
    deleteMessage(): string
    {
        return 'user is deleting a message';
    }
}
