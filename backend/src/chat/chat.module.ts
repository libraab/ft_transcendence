import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { DatabaseService } from 'src/database/database.service';
import { createRoomDto } from 'src/dashboard/dashboardDtos/createsTablesDtos';

@Module({
  controllers: [ChatController],
  providers: [ChatGateway, DatabaseService, createRoomDto],
})
export class ChatModule {}