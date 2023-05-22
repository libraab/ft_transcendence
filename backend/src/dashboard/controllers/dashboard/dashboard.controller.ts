import { Body, Controller, Get, Param, ParseIntPipe, Post, StreamableFile} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ClientDto } from 'src/database/dtos/dbBaseDto';
import { UpdateClientDto } from 'src/dashboard/dashboardDtos/updateClientDto';
import { Req } from '@nestjs/common';
import { createRelationsDto, createStatsDto, updateStatDto } from 'src/dashboard/dashboardDtos/createsTablesDtos';
import { FastifyRequest } from 'fastify';
import { v4 as uuidv4 } from 'uuid'
import * as fs from 'fs';

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

	@Get('/getfile/:filename')
	getFile(@Param('filename') fileName: string ): StreamableFile {
		const file = fs.createReadStream(process.cwd() + "/uploads/" + fileName);
		return new StreamableFile(file);
	}

	@Post('/update/:id')
	async changePicture(@Param('id', ParseIntPipe) id: number, @Req() req: FastifyRequest)
	{
		let dto: UpdateClientDto = new UpdateClientDto();
		const data = await req.file();
		const valid_mime: string[] = [ "image/gif", "image/jpeg", "image/png", "image/bmp", "image/tiff" ]; // formats that we accept 
		if (valid_mime.includes(data.mimetype)) {
			const tmp_name = uuidv4();
			var pump = require('pump');
			await pump(data.file, fs.createWriteStream(process.cwd() + "/uploads/" + tmp_name));
			dto.img = "http://localhost:3000/dashboard/getfile/" + tmp_name;
			console.log('image path is -> ', dto.img);
			return this.db.updateClient(id, dto);
		}
		console.log(data);
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
function Autorization() {
	throw new Error('Function not implemented.');
}

