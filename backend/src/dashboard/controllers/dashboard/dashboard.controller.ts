import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ClientDto, UpdateClientDto } from 'src/database/dtos/dbBaseDto';

@Controller('dashboard')
export class DashboardController
{
	constructor(private db: DatabaseService)
	{}

	@Get('/name/:name')
	searchFor(@Param('name') name: string)
	{
		return this.db.findClientsByName(name);
	}

	@Get(':id')
	getByid42(@Param('id', ParseIntPipe) id: number)
	{
		return this.db.getClientById42(id);
	}

	@Get('/stats/:id')
	getStatsbyId(@Param('id', ParseIntPipe) id: number)
	{
		return this.db.getClientStatsById(id);
	}

	@Get('/ranking')
	getRanking()
	{
		return this.db.getTop100Scores();
	}

	@Get('/fl/:id')
	getFlForId42(@Param('id', ParseIntPipe) id: number)
	{
		return this.db.getRelationsByClientId1(id);
	}


	@Post('/create')
	createClient(@Body() dto: ClientDto)
	{
		return this.db.createClient(dto);
	}

	@Post('update/:id')
	updateClient(@Param('id', ParseIntPipe) id:number, @Body() dto: UpdateClientDto)
	{
		return this.db.updateClient(id, dto);
	}

	@Get('get/:id')
	getById(@Param('id', ParseIntPipe) id42: number)
	{
		return this.db.getClientId42FromId(id42);
	}

}
