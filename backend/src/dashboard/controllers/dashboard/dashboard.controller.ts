import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ClientDto } from 'src/database/dtos/dbBaseDto';
import { UpdateClientDto } from 'src/dashboard/dashboardDtos/updateClientDto';
import { Req } from '@nestjs/common';


@Controller('dashboard')
export class DashboardController
{
	constructor(private db: DatabaseService)
	{}

	@Get('/name/:name')
	async searchFor(@Param('name') name: string)
	{
		return this.db.findClientsByName(name);
	}

	@Get(':id')
	async getByid42(@Param('id', ParseIntPipe) id: number)
	{
		return this.db.getClientById42(id);
	}

	@Get('/stats/:id')
	async getStatsbyId(@Param('id', ParseIntPipe) id: number)
	{
		return this.db.getClientStatsById(id);
	}

	@Get('/ranking')
	async getRanking()
	{
		return this.db.getTop100Scores();
	}

	@Get('/fl/:id')
	async getFlForId42(@Param('id', ParseIntPipe) id: number)
	{
		return this.db.getRelationsByClientId1(id);
	}


	@Post('/create')
	async createClient(@Body() dto: ClientDto)
	{
		return this.db.createClient(dto);
	}

	@Post('update/:id')
	async updateClient(@Param('id', ParseIntPipe) id:number, @Body() dto: UpdateClientDto)
	{
		return this.db.updateClient(id, dto);
	}

	@Get('get/:id')
	async getById(@Param('id', ParseIntPipe) id42: number)
	{
		return this.db.getClientId42FromId(id42);
	}

}
