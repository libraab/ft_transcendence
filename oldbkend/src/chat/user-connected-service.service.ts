import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class UserConnectedService {
	hmap = new Map<string, number>();

	addUser(user: Socket, userId: number): void
	{
		this.hmap.set(user.id, userId);
		console.log(this.hmap);
	}

	deleteUser(user: Socket): void
	{
		this.hmap.delete(user.id);
	}

	checkStatus(id: number): number
	{
		let status = 0;
		this.hmap.forEach((value, key, map) =>
		{
			if (value == id)
				status = 1;
		});
		return (status);
	}

	findSocketId(id: number): string
	{
		let res = "";
		console.log(id);
		this.hmap.forEach((value, key, map) =>
		{
			if (value == id)
				res = key;
		});
		return res;
	}
}
