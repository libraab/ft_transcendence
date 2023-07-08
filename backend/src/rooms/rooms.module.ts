import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [RoomsController],
  providers: [DatabaseService],
})
export class RoomsModule {}
