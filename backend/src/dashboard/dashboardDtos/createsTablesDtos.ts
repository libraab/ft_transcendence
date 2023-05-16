import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class createRelationsDto
{
	@IsNotEmpty()
	@IsNumber()
	idClient1: number;
	
	@IsNotEmpty()
	status: number;
	
	@IsNotEmpty()
	@IsNumber()
	idClient2: number;
}

export class createStatsDto
{
	played: number;
	won: number;
	score: string;
	title: string;
	hf: string;
}

export class createRoomDto
{
	@IsNotEmpty()
	@IsString()	
	name: string;
	
	@IsNotEmpty()
	@IsNumber()
	ownerid: number;

	@IsNotEmpty()
	@IsNumber()
	secu: number;
}
