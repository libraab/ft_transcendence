import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { DatabaseService } from 'src/database/database.service';
import { ChatGateway } from 'src/chat/chat.gateway';
import { UserConnectedService } from 'src/chat/user-connected-service.service';

@Module({
  controllers: [RoomsController],
  providers: [DatabaseService],
})
export class RoomsModule {}
