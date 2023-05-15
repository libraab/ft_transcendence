import { IsNotEmpty, IsNumber } from "class-validator";

export class createRelationsDto
{
	@IsNotEmpty()
	@IsNumber()
	idClient1: number;
	
	@IsNotEmpty()
	status: string;
	
	@IsNotEmpty()
	@IsNumber()
	idClient2: number;
}
