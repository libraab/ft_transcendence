import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

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
			length: 200,
			nullable: false
		}
	)
	cookie: string;

	@Column(
		{
			type: 'varchar',
			length: 15,
			nullable: false,
		}
	)
	num: string;

	@Column(
		{
			type: 'bigint',
			array: true,
		}
	)
	rooms: bigint[];
}
