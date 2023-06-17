import { BadRequestException, Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, StreamableFile} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { ClientDto } from 'src/database/dtos/dbBaseDto';
import { UpdateClientDto } from 'src/dashboard/dashboardDtos/updateClientDto';
import { Req } from '@nestjs/common';
import { createRelationsDto, createStatsDto, updateStatDto } from 'src/dashboard/dashboardDtos/createsTablesDtos';
import { FastifyRequest } from 'fastify';
import { v4 as uuidv4 } from 'uuid'
import * as fs from 'fs';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';

@Controller('dashboard')
export class DashboardController
{
	constructor(private db: DatabaseService) {}

	@Get(':id')
	async getByid42(@Param('id', ParseIntPipe) id: number)
	{
		console.log("HAAAAAAAAAAAAAAAAAAAAAAAA");
		return this.db.getClientById42Dashboard(id);
	}

	@Get('/getByName/:id/:userName')
	async getByName(@Param('id', ParseIntPipe) id: number,
					@Param('userName') userName: string)
	{
		try
		{
			return this.db.getClientByName(id, userName);
		}
		catch (error)
		{
			throw new HttpException("userNotFound", 404);
		}
	}
	
	@Get('getTargetWithRelation/:id/:name')
	async getTarget(@Param('id', ParseIntPipe) id: number,
					@Param('name') name: string)
	{
		console.log("i shouldn't be here");
		try
		{
			return this.db.getTarget(id, name);
		}
		catch (error)
		{
			console.error(error);
			throw new HttpException("userNotFound", 404);
		}
	}

	@Get('/42/:id')
	async getByid(@Param('id', ParseIntPipe) id: number)
	{
		return this.db.getClientById(id);
	}

	@Get('/42/:id')
	async getByid(@Param('id', ParseIntPipe) id: number)
	{
		return this.db.getClientById(id);
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
		try
		{
			const file = fs.createReadStream(process.cwd() + "/uploads/" + fileName);
			return new StreamableFile(file);
		}
		catch (error)
		{
			throw new HttpException(error, 404);
		}
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
			console.log('new image path is -> ', dto.img);
			return this.db.updateClient(id, dto);
		}
		throw new BadRequestException();
	}
	
	@Post('/updateName/:id')
	async changeName(@Param('id', ParseIntPipe) id: number, @Body() name: string)
	{
		if (name.length < 50) {
			let dto: UpdateClientDto = new UpdateClientDto();
			dto.name = name;
			return this.db.updateClient(id, dto);
		}
		throw new BadRequestException();
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

	@Get('/name/:id/:name')
	async searchFor(@Param('id', ParseIntPipe) id: number,
					@Param('name') name: string)
	{
		return this.db.findClientsByName(id, name);
	}



	@Post('/supprFriendship/:id1/:id2')
	async supprFriendship(@Param('id1', ParseIntPipe) id1: number,
							@Param('id2', ParseIntPipe) id2: number)
	{
		if (id1 === id2)
			throw new HttpException("you so funny Larry", HttpStatus.BAD_REQUEST);

		try {
			await this.db.removeClientsFromClient(id1, id2);
			return HttpStatus.NO_CONTENT;
		}
		catch (error)
		{
			console.error(error);
			throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		}
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

