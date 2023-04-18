import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { Client } from "./client";
import { Room } from "./room";

@Entity()
export class Messages_rooms
{
	@PrimaryGeneratedColumn(
		{
			type: 'bigint',
			name: 'msg_room_id'
		}
	)
	id: bigint;

	@ManyToOne(() => Client, { onDelete: 'CASCADE' })
	client: Client;

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
	
	@ManyToOne(() => Room, { onDelete: 'CASCADE' })
	room: Room;
}
