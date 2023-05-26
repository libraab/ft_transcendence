import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { DatabaseService } from 'src/database/database.service';

@Module({
	controllers: [GameController],
	providers: [GameGateway, DatabaseService],
})
export class GameModule {}
