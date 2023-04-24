import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { Client } from "./client";

@Entity()
export class Messages_clients
{
	@PrimaryGeneratedColumn(
		{
			type: 'bigint',
			name: 'msg_client_id'
		}
	)
	id: bigint;

	@ManyToOne(() => Client, { onDelete: 'CASCADE' })
	client_src: Client;

	@Column(
		{
			type: 'text',
			nullable: false
		}
	)
	msg: string;

	@Column(
		{
			type: 'timestamp',
			default: () => 'CURRENT_TIMESTAMP' 
		}
	)
	time: Timestamp;

	@ManyToOne(() => Client, { onDelete: 'CASCADE' })
	client_dest: Client;
}