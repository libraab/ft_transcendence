import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { DatabaseService } from 'src/database/database.service';
import { UserConnectedService } from './user-connected-service.service';

@WebSocketGateway({
	path: '/chatsockets',
	namespace: '/chat',
	cors: {
	  origin: 'http://localhost:8080',
	},
  })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() wss: Server;
	constructor(private db: DatabaseService, private usersConnected: UserConnectedService) {}
	
	private logger: Logger = new Logger('ChatGateway');
	
	afterInit(server: Server) {
		this.logger.log('Initialized');
	}
	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected : ${client.id}`);
	}
	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected : ${client.id}`);
		this.usersConnected.deleteUser(client);
	}

	@SubscribeMessage('whoAmI')
	addToUsers(user: Socket, id: number)
	{
		this.usersConnected.addUser(user, id);
	}

	// @SubscribeMessage('setUsername')
  	// handleSetUsername(socket: Socket, username: string) {
    // 	this.logger.log(`Received username: ${username}`);
    // 	socket.username = username; // Store the username in the socket object
  	// }
	

	@SubscribeMessage('chatToServer')
	async handleMessage(client: Socket, message: {channel: string, sender: string, message: string, sender_id: number} ) {
		this.logger.log(`A message was send by ${message.sender} --content--> ${message.message}`);
		let client_id = await this.db.getClientById42(message.sender_id);
		await this.addMessageToRoom({ id: message.channel, sender: client_id.id, msg: message.message});
		this.wss.to(message.channel).emit('serverToChat', message);
		this.wss.to(message.channel).emit('serverAlertToChat', message);
		// WsResponse<string>
    	// return { event: 'msgToClient', data: text};
  	}

	@SubscribeMessage('joinChannel')
	handleJoinChannel(client: Socket, channel: string)
	{
		// check if channel id is existing if not do nothing
		// check if client is a member of channel then proceed
		client.join(channel);
		client.emit('joinedChannel', channel);
	}

	@SubscribeMessage('leaveChannel')
	handleLeaveChannel(client: Socket, channel: string)
	{
		// check if channel id is existing if not do nothing
		// check if client is a member of channel then proceed
		// ask the chat service to delete the user from members
		client.leave(channel);
		client.emit('leavedChannel', channel);
	}

	async addMessageToRoom(data: any) {
		console.log(data);
        this.db.addMessageToRoom(data.id, data.sender, data.msg);
    }
}
