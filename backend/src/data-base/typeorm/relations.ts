import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./client";

@Entity()
export class Relations
{
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Client,
		{
			onDelete: 'CASCADE',
			nullable: false
		}
	)
	client1: Client;

	@ManyToOne(() => Client,
		{
			onDelete: 'CASCADE',
			nullable: false
		}
	)
	client2: Client;

	@Column({
		type: 'varchar',
		length: 10,
		nullable: false
	})
	status: string;
}
