import { IsString, IsNotEmpty, MaxLength, IsNumber } from 'class-validator';

export class ClientDto
{
	@IsNumber()
	@IsNotEmpty()
	id42: number;
/*
	@IsOptional()
	@IsBase64()
	@Transform(({ value }) => Buffer.from(value, 'base64'))
	@IsMimeType()
	img: Buffer;
*/
	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	name: string;
}

