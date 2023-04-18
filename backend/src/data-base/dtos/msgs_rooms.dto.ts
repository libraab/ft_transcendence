import { Timestamp } from "typeorm";

export class MessagesClientDto
{
	id: bigint;
	client: bigint;
	msg: string;
	time: Timestamp;
}
