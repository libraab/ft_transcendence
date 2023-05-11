import { IsString, IsNotEmpty, MaxLength, IsNumber } from 'class-validator';

export class ClientDto
{
	@IsNumber()
	@IsNotEmpty()
	id42: number;
/*
	@IsOptional()
	@IsMimeType()
	img: Buffer;
*/
	@IsString()
	// @IsNotEmpty()
	@MaxLength(50)
	name: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(250)
	cookie: string;
}

