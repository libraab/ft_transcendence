import { Logger, ParseFloatPipe, ParseIntPipe } from '@nestjs/common';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Console } from 'console';
import { Server, Socket } from 'socket.io';
import { Client } from 'socket.io/dist/client';
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

	@SubscribeMessage('pads')
	plyrMvt(
		@MessageBody(ParseFloatPipe) data: string,
		@ConnectedSocket() client: Socket,)

	{
		console.log(data);
		// update in room
		// update for opponent
	}

	@SubscribeMessage('Challenge')
	defy(@MessageBody() data: string,
			@ConnectedSocket() client: Socket,)
	{
		console.log('New challenger arrived');
		// frontend gestion d'invitation
		// client.emit('challenge sent');
	}

	@SubscribeMessage('acceptChallenge')
	acceptChallenge(@MessageBody() data: string,
			@ConnectedSocket() client: Socket,)
	{
		console.log('i gonna smoke you up !!!');
		// go to joinRoom
		// + leave lobby
		// client.emit('accept');
	}

	@SubscribeMessage('refuseChallenge')
	refuseChallenge(@MessageBody() data: string,
			@ConnectedSocket() client: Socket,)
	{
		console.log('i\'m scared :\'( ');
		// nothing just stay in lobby
		// client.emit('refused');
	}

	handleJoinRoom(client: Socket, id:number)
	{
	/*	
		// Générer un identifiant unique pour la room
		const roomId = 'room1'; // Vous devez implémenter votre propre logique de génération d'ID de room

		// Joindre la room avec l'ID généré
		client.join(roomId);

		// Diffuser un événement pour informer les clients qu'ils ont rejoint la room
		this.server.to(roomId).emit('room1', roomId);
	*/		

		client.emit('joinRoom', 'hey');
	}
}
