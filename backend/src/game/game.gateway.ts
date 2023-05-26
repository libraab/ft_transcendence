import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DatabaseService } from 'src/database/database.service';


@WebSocketGateway(
	{ 
		namespace: 'pong',
		cors:{
			origin: 'http://localhost:8080',
		},
	}
)
export class GameGateway
{
	@WebSocketServer()
	server: Server;

	constructor(private db: DatabaseService) {}
	
	private logger: Logger = new Logger('PongGateway');
	
	afterInit(server: Server)
	{
		this.logger.log('Initialized');
	}
	
	handleConnection(client: Socket, ...args: any[])
	{
		this.logger.log(`Client connected : ${client.id}`);
	}
	
	handleDisconnect(client: Socket)
	{
		this.logger.log(`Client disconnected : ${client.id}`);
	}


	@SubscribeMessage('PongMessage')
	handleMessage(client: Socket, payload: any)
	{
		console.log('herein message');
		return 'Hello World';
	}


	@SubscribeMessage('PongJoinRoom')
	handleJoinRoom(
		@MessageBody() data: string,
		@ConnectedSocket() client: Socket,)
	{
		console.log('haahahahahahahahahaah');

	/*	
		// Générer un identifiant unique pour la room
		const roomId = 'room1'; // Vous devez implémenter votre propre logique de génération d'ID de room

		// Joindre la room avec l'ID généré
		client.join(roomId);

		// Diffuser un événement pour informer les clients qu'ils ont rejoint la room
		this.server.to(roomId).emit('room1', roomId);
	*/		

		client.emit('joinRoom', 'hey');
		return 'Hello Pong';
	}
}
