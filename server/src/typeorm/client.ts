import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room";

@Entity()
export class Client
{
	@PrimaryGeneratedColumn(
		{
			type: 'bigint',
			name: 'client_id'
		}
	)
	id: bigint;

	@Column(
		{
			type: 'bytea',
			nullable: false
		}
	)
	img: Buffer;

	@Column(
		{
			type: 'varchar',
			length: 50,
			nullable: false
		}
	)
	name: string;

	@Column(
		{
			type: 'varchar',
			length: 50
		}
	)
	pseudo: string;

	@Column(
		{
			type: 'varchar',
			length: 100,
			nullable: false
		}
	)
	email: string;

	@Column(
		{
			type: 'varchar',
			length: 100,
			nullable: false
		}
	)
	password: string;

	@Column(
		{
			type: 'varchar',
			length: 100,
			default: ''
		}
	)
	title: string;

	@Column(
		{
			type: 'bigint',
			default: 0
		}
	)
	played: string;

	@Column(
		{
			type: 'bigint',
			default: 0
		}
	)
	won: string;

	@Column(
		{
			type: 'text',
			default: ''
		}
	)
	hf: string;

	@Column(
		{
			type: 'varchar',
			length: 15,
			nullable: false,
		}
	)
	num: string;

	@ManyToMany(() => Room, room => room.members, {
		onDelete: 'CASCADE'
	})
	@JoinTable({
		name: 'client_rooms',
		joinColumn: { name: 'client_id', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'room_id', referencedColumnName: 'id' },
	})
	rooms: Room[];
}