import { Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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

	@Column(
		{
			type: 'bigint',
			array: true,
		}
	)
	members: bigint[];

	@Column(
		{
			type: 'bigint',
			array: true,
		}
	)
	admins: bigint[];

	@Column(
		{
			type: 'bigint',
		}
	)
	owner: bigint;
}
