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
	
	@IsString()
	@IsNotEmpty()
	@MaxLength(50)
	pseudo: string;

	@IsEmail()
	@IsNotEmpty()
	@MaxLength(100)
	email: string;

	@IsNotEmpty()
	@IsString()
//	@IsBase64()
	@MaxLength(200)
	cookie: string;

	@IsOptional()
	@IsString()
	@MaxLength(15)
	@IsPhoneNumber('FR')
	num: string;
}
