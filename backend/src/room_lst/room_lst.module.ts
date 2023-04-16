import { Module } from '@nestjs/common';
import { RoomLstController } from './room_lst.controller';

@Module({
  controllers: [RoomLstController]
})
export class RoomLstModule {}
