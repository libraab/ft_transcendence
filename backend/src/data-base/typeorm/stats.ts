import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./client";

@Entity()
export class Client_Stats
{
	@PrimaryGeneratedColumn(
		{
			type: 'bigint',
		}
	)
	id: bigint;
	
	@OneToOne(() => Client, client => client.id, {
		onDelete: 'CASCADE'
	})
	client_id: Client;

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
	played: number;

	@Column(
		{
			type: 'bigint',
			default: 0
		}
	)
	score: number;

	@Column(
		{
			type: 'bigint',
			default: 0
		}
	)
	won: number;

	@Column(
		{
			type: 'varchar',
			length: 100,
			default: ''
		}
	)
	hf: string;
}