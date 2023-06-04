import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  leftPlayer: Socket;
  rightPlayer: Socket;
  leftScore = 0;
  rightScore = 0;
  readyPlayers = 0;
  leftPlayerSkin: string;
  rightPlayerSkin: string;
  leftPlayerUsername: string;
  rightPlayerUsername: string;

  afterInit(server: Server) {
    console.log('WebSocket server initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    if (client === this.leftPlayer || client === this.rightPlayer) {
      this.server.emit('emptyRoom');
      this.leftPlayer = null;
      this.rightPlayer = null;
      this.readyPlayers = 0;
      this.leftScore = 0;
      this.rightScore = 0;
    }
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, options: any) {
    if (!this.leftPlayer) {
      this.leftPlayer = client;
      this.leftPlayerUsername = options.player_name;
      client.emit('player', 'left');
      this.leftPlayerSkin = options.padSkin;
    } else if (!this.rightPlayer) {
      this.rightPlayer = client;
      this.rightPlayerUsername = options.player_name;
      client.emit('player', 'right');
      this.server.emit('playerSkin', { left: this.leftPlayerSkin, right: this.rightPlayerSkin });
      this.server.emit('playersFound', {
        player_left_id: this.leftPlayer.id,
        player_right_id: this.rightPlayer.id,
      });

      this.server.emit('paddle_left', { x: 0, y: 0 });
      this.server.emit('paddle_right', { x: 0, y: 0 });
      this.server.emit('launch', { x: 0, y: 0 });
      this.server.emit('set_ball_position', { x: 0, y: 0 });
    } else {
      client.emit('player', 'spectator');
    }
  }

  @SubscribeMessage('move_left_pad')
  handleMoveLeftPad(client: Socket, message: any) {
    if (client === this.leftPlayer || client === this.rightPlayer || client.id === 'spectator') {
      this.server.emit('paddle_left', { x: message.x, y: message.y });
    }
  }

  @SubscribeMessage('move_right_pad')
  handleMoveRightPad(client: Socket, message: any) {
    if (client === this.leftPlayer || client === this.rightPlayer || client.id === 'spectator') {
      this.server.emit('paddle_right', { x: message.x, y: message.y });
    }
  }

  @SubscribeMessage('ready')
  handleReady(client: Socket) {
    this.readyPlayers++;
    if (this.readyPlayers === 2) {
      this.server.emit('launch', { x: 500, y: 500 });
    }
  }

  @SubscribeMessage('ball_position')
  handleBallPosition(client: Socket, message: any) {
    if (client === this.leftPlayer || client === this.rightPlayer || client.id === 'spectator') {
      this.server.emit('set_ball_position', { x: message.x, y: message.y });
    }
  }

  @SubscribeMessage('score_update')
  handleScoreUpdate(client: Socket, message: any) {
    this.leftScore = message.score_left;
    this.rightScore = message.score_right;
    this.server.emit('updated_score', { score_left: this.leftScore, score_right: this.rightScore });
  }

  @SubscribeMessage('game_finished')
  handleGameFinished(client: Socket, message: any) {
    this.server.emit('end', {
      player_left: this.leftPlayer.id,
      player_right: this.rightPlayer.id,
      score: { right: this.rightScore, left: this.leftScore },
      winner: message.winner,
      left_username: this.leftPlayerUsername,
      right_username: this.rightPlayerUsername,
    });

    this.leftPlayer = null;
    this.rightPlayer = null;
    this.readyPlayers = 0;
    this.leftScore = 0;
    this.rightScore = 0;
  }
}
