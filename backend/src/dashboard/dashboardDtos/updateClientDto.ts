import { IsString, IsOptional, MaxLength, isString } from 'class-validator';

export class UpdateClientDto
{
	@IsOptional()
	@IsString()
	@MaxLength(50)
	name?: string;

	@IsOptional()
	@IsString()
	img?: string;

	@IsOptional()
	@IsString()
	@MaxLength(250)
	cookie?: string;
  }