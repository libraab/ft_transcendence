import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './typeorm';

@Module({
  imports: [TypeOrmModule.forRoot(
    {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'math',
      password: 'sdb',
      database: 'my_database',
      entities,
      synchronize: true
    }
  )],
  controllers: [],
  providers: [],
})
export class AppModule {}
