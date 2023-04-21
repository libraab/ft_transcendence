import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { UsersModule } from './users/users.module';
import { RoomLstModule } from './room_lst/room_lst.module';
//import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [ChatModule, UsersModule, RoomLstModule, /*AuthModule,*/ DashboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
