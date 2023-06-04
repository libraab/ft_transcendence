import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'http';
import * as socketio from 'socket.io';
import { AppModule } from './app.module';
import { GameGateway } from './game.gateway';


class SocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: socketio.ServerOptions): socketio.Server {
    const server = super.createIOServer(port, { ...options, cors: true });
    server.use((socket, next) => {
      const req = socket.request;
      const res = {} as any;
      next();
    });
    return server;
  }
}

async function bootstrap() {
  const expressApp = express();
  const httpServer = new Server(expressApp);
  // const app = await NestFactory.create(AppModule, httpServer, {
  //   cors: true,
  // });
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useWebSocketAdapter(new SocketIoAdapter(app));

  await app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
}

bootstrap();

/*
  const io = new Server(server, { cors: { origin: '*' } });

  let leftPlayer: Socket;
  let rightPlayer: Socket;
  let leftScore = 0;
  let rightScore = 0;
  let readyPlayers = 0;
  let leftPlayerSkin: string;
  let rightPlayerSkin: string;
  let leftPlayerUsername: string;
  let rightPlayerUsername: string;

  io.on('connection', (socket: Socket) => {
    console.log('Connected to server');

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      if (socket === leftPlayer || socket === rightPlayer) {
        io.emit('emptyRoom');
        leftPlayer = null;
        rightPlayer = null;
        readyPlayers = 0;
        leftScore = 0;
        rightScore = 0;
      }
    });

    socket.on('join', (options) => {
      if (!leftPlayer) {
        leftPlayer = socket;
        leftPlayerUsername = options.player_name;
        socket.emit('player', 'left');
        leftPlayerSkin = options.padSkin;
      } else if (!rightPlayer) {
        rightPlayer = socket;
        rightPlayerUsername = options.player_name;
        socket.emit('player', 'right');
        io.emit('playerSkin', { left: leftPlayerSkin, right: options.padSkin });
        io.emit('playersFound', {
          player_left_id: leftPlayer.id,
          player_right_id: rightPlayer.id,
        });

        io.emit('paddle_left', { x: 0, y: 0 });
        io.emit('paddle_right', { x: 0, y: 0 });
        io.emit('launch', { x: 0, y: 0 });
        io.emit('set_ball_position', { x: 0, y: 0 });
      } else {
        socket.emit('player', 'spectator');
      }
    });

    socket.on('move_left_pad', (message) => {
      if (socket === leftPlayer || socket === rightPlayer || socket.id === 'spectator') {
        io.emit('paddle_left', { x: message.x, y: message.y });
      }
    });

    socket.on('move_right_pad', (message) => {
      if (socket === leftPlayer || socket === rightPlayer || socket.id === 'spectator') {
        io.emit('paddle_right', { x: message.x, y: message.y });
      }
    });

    socket.on('ready', () => {
      readyPlayers++;
      if (readyPlayers === 2) {
        io.emit('launch', { x: 500, y: 500 });
      }
    });

    socket.on('ball_position', (message) => {
      if (socket === leftPlayer || socket === rightPlayer || socket.id === 'spectator') {
        io.emit('set_ball_position', { x: message.x, y: message.y });
      }
    });

    socket.on('score_update', (message) => {
      leftScore = message.score_left;
      rightScore = message.score_right;
      io.emit('updated_score', { score_left: leftScore, score_right: rightScore });
    });

    socket.on('game_over', () => {
      leftPlayer = null;
      rightPlayer = null;
      readyPlayers = 0;
      leftScore = 0;
      rightScore = 0;
      io.emit('game_over');
    });
  });
*/

