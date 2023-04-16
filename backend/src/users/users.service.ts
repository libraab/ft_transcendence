import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
    private readonly users = [
      {
        userId: 1,
        username: 'john',
      },
      {
        userId: 2,
        username: 'maria',
      },
    ];
  
    async findOne(username: string): Promise<User | undefined> {
      return this.users.find(user => user.username === username);
    }
  }