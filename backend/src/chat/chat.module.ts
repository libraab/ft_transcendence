import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [ChatController],
  providers: [ChatGateway, DatabaseService],
})
export class ChatModule {}
