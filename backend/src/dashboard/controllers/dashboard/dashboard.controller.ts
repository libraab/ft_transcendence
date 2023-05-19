import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ClientDto } from 'src/database/dtos/dbBaseDto';
import { UpdateClientDto } from 'src/dashboard/dashboardDtos/updateClientDto';
import { Req } from '@nestjs/common';
import { createRelationsDto, createStatsDto, updateStatDto } from 'src/dashboard/dashboardDtos/createsTablesDtos';


@Controller('dashboard')
export class DashboardController
{
	constructor(private db: DatabaseService) {}

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

	@Get('/fl/:id')
	async getFlForId42(@Param('id', ParseIntPipe) id: number)
	{
		return this.db.getRelationsByClientId1(id);
	}

	@Post('update/:id')
	async updateClient(@Param('id', ParseIntPipe) id:number, @Body() dto: UpdateClientDto)
	{
		return this.db.updateClient(id, dto);
	}







	@Get('/ranking')
	async getRanking()
	{
		return this.db.getTop100Scores();
	}

	@Get('/cookie/:cookie')
	async getByCookie(@Param('cookie') cookie: string)
	{
		return this.db.getClientByCookie(cookie);
	}

	@Get('/name/:name')
	async searchFor(@Param('name') name: string)
	{
		return this.db.findClientsByName(name);
	}











	@Post('/create')
	async createClient(@Body() dto: ClientDto)
	{
		return this.db.createClient(dto);
	}

	@Post('/relations/create')
	async createRelations(@Body() dto: createRelationsDto)
	{
		return this.db.createRelation(dto);
	}

	@Post('/stats/create')
	async createStats(@Body() dto: createStatsDto)
	{
		return this.db.createClientStat(dto);
	}

	@Post('/stats/update/:id')
	async updateStats(@Param('id', ParseIntPipe) id: number, @Body() dto: updateStatDto)
	{
		return this.db.updateStat(id, dto);
	}
}
