import { Controller, Get, Post } from '@nestjs/common';

@Controller('room-lst')
export class RoomLstController {

    @Get()
    getAllChat(): string
    {
        return 'returning all disponible chat';
    }

    @Post()
    joinRoom(): string
    {
        return 'user is joinning the channel';
    }

}
