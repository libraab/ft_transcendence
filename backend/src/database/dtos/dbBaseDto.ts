import { Transform } from 'class-transformer';
import { IsString, IsEmail, IsNotEmpty, IsOptional, MaxLength, IsPhoneNumber, IsBase64, IsMimeType, isNumber, IsNumber } from 'class-validator';

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

export class UpdateClientDto
{
	@IsOptional()
	@IsString()
	@IsBase64()
	@Transform(({ value }) => Buffer.from(value, 'base64'))
	@IsMimeType()
	img?: Buffer;

	@IsOptional()
	@IsString()
	@MaxLength(50)
	name?: string;
  }
