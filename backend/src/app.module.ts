import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { UsersModule } from './users/users.module';
import { RoomModule } from './room/room.module';
import { RoomLstModule } from './room_lst/room_lst.module';

@Module({
  imports: [ChatModule, UsersModule, RoomModule, RoomLstModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
