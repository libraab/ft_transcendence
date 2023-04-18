import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { UsersModule } from './users/users.module';
import { RoomLstModule } from './room_lst/room_lst.module';
import { AuthModule } from './auth/auth.module';
import { DataBaseModule } from './data-base/data-base.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardModule } from './dashboard/dashboard.module';
import entities from './data-base/typeorm';

@Module({
  imports: [ChatModule, UsersModule, RoomLstModule, AuthModule, DataBaseModule, TypeOrmModule.forRoot(
    {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'math',
      password: 'sdb',
      database: 'my_database',
      entities,
      synchronize: true
    }
  ), DashboardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
