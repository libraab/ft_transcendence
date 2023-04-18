import { Module } from '@nestjs/common';

@Module({})
export class DataBaseModule {}


/*
-------------------------------------------
to ask GPT
-------------------------------------------

en nestjs.
C'est le app.module.ts :
@Module({
  imports: [ChatModule, UsersModule, RoomLstModule, AuthModule, DataBaseModule, TypeOrmModule.forRoot(
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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

c'est le databasemodule:
import { Module } from '@nestjs/common';

@Module({})
export class DataBaseModule {}

est t il possible de mettre la partie : 
TypeOrmModule.forRoot(
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
  )
dans le module database plutot que dans le app.module en faisant en sorte que ça marche pareil ? 

*/