import { Timestamp } from "typeorm";

export class MessagesClientDto
{
	id: bigint;
	client_src: bigint;
	client_dest: bigint;
	msg: string;
	time: Timestamp;
}
