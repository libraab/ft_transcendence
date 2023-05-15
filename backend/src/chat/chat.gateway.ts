import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	path: '/chatsockets',
	namespace: '/',
	cors: {
	  origin: '*',
	},
  })
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	@WebSocketServer() wss: Server;
	
	private logger: Logger = new Logger('ChatGateway');
	
	afterInit(server: Server) {
		this.logger.log('Initialized');
	}
	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected : ${client.id}`);
	}
	handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected : ${client.id}`);
	}
	

	@SubscribeMessage('msgToServer')
	handleMessage(client: any, text: string): void {
		this.logger.log(`A message was send by ${client.id} --content--> ${text}`);
		this.wss.emit('msgToClient', text);
		// WsResponse<string>
    	// return { event: 'msgToClient', data: text};
  	}
}
