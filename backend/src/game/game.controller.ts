import { Controller } from '@nestjs/common';
import { validateSync } from 'class-validator';
import { DatabaseService } from 'src/database/database.service';

export class gameHistoricDto
{
    client1Id: number;
    scoreClient1: number;
    client2Id: number;
    scoreClient2: number;
}

@Controller('game')
export class GameController {
    constructor(private db: DatabaseService){}
    
    async ft_test(param: gameHistoricDto)
    {
        return this.db.ComTest(param);
    }

}
