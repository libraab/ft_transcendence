import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./client";

@Entity()
export class Room
{
	@PrimaryGeneratedColumn(
		{
			type: 'bigint',
			name: 'room_id'
		}
	)
	id: bigint;

	@Column(
		{
			type: 'varchar',
			length: 50,
			nullable: false
		}
	)
	name: string;

	@ManyToMany(() => Client, client => client.rooms, {
		onDelete: 'CASCADE'
	})
	@JoinTable({
		name: 'client_rooms',
		joinColumn: { name: 'room_id', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'client_id', referencedColumnName: 'id' },
	})
	members: Client[];
}