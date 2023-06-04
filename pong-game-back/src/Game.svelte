<script>
  import { onMount } from 'svelte';
  import { io } from 'socket.io-client';

  // Global Variables
  const DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
  };

  const rounds = [5, 5, 3, 3, 2];
  const colors = ['#1abc9c', '#2ecc71', '#3498db', '#8c52ff', '#9b59b6'];

  // The ball object (The cube that bounces back and forth)
  const Ball = {
    new(incrementedSpeed) {
      return {
        width: 18,
        height: 18,
        x: (canvas.width / 2) - 9,
        y: (canvas.height / 2) - 9,
        moveX: DIRECTION.IDLE,
        moveY: DIRECTION.IDLE,
        speed: incrementedSpeed || 7
      };
    }
  };

  let canvas;
  let context;
  let ball;
  let socket;
  let playerSide;
  let playerPosition = { x: 0, y: 0, width: 18, height: 180, score: 0, move: DIRECTION.IDLE, speed: 8 };
  let opponentPosition = { x: 0, y: 0, width: 18, height: 180, score: 0, move: DIRECTION.IDLE, speed: 8 };

  const initialize = () => {
    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');

    canvas.width = 1400;
    canvas.height = 1000;

    canvas.style.width = (canvas.width / 2) + 'px';
    canvas.style.height = (canvas.height / 2) + 'px';

    ball = Ball.new();

    socket = io('http://localhost:3000'); // Connect to the server

    socket.on('player', (side) => {
      playerSide = side;
    });

    socket.on('playerSkin', (skins) => {
      // Handle player skins
    });

    socket.on('paddle_left', (position) => {
      opponentPosition = position;
    });

    socket.on('paddle_right', (position) => {
      playerPosition = position;
    });

    socket.on('set_ball_position', (position) => {
      ball.x = position.x;
      ball.y = position.y;
    });

    socket.on('updated_score', (scores) => {
      playerPosition.score = scores.score_left;
      opponentPosition.score = scores.score_right;
    });

    socket.on('end', (result) => {
      // Handle game end
      if (result === 'win') {
        endGameMenu('Winner!');
      } else if (result === 'lose') {
        endGameMenu('Game Over!');
      }
    });

    menu();
    listen();
  };

  const endGameMenu = (text) => {
    context.font = '45px Courier New';
    context.fillStyle = '#ffffff';

    context.fillRect(
      canvas.width / 2 - 350,
      canvas.height / 2 - 48,
      700,
      100
    );

    context.fillStyle = '#ffffff';

    context.fillText(text,
      canvas.width / 2,
      canvas.height / 2 + 15
    );

    setTimeout(() => {
      initialize();
    }, 3000);
  };

  const menu = () => {
    draw();

    context.font = '50px Courier New';
    context.fillStyle = '#ffffff';

    context.fillRect(
      canvas.width / 2 - 350,
      canvas.height / 2 - 48,
      700,
      100
    );

    context.fillStyle = '#ffffff';

    context.fillText('Press any key to begin',
      canvas.width / 2,
      canvas.height / 2 + 15
    );
  };

  const update = () => {
    if (!over) {
      if (ball.x <= 0) resetTurn(opponentPosition, playerPosition);
      if (ball.x >= canvas.width - ball.width) resetTurn(playerPosition, opponentPosition);
      if (ball.y <= 0) ball.moveY = DIRECTION.DOWN;
      if (ball.y >= canvas.height - ball.height) ball.moveY = DIRECTION.UP;

      if (playerPosition.y <= 0) playerPosition.y = 0;
      else if (playerPosition.y >= (canvas.height - playerPosition.height)) playerPosition.y = (canvas.height - playerPosition.height);

      if (opponentPosition.y <= 0) opponentPosition.y = 0;
      else if (opponentPosition.y >= (canvas.height - opponentPosition.height)) opponentPosition.y = (canvas.height - opponentPosition.height);

      if (playerSide === 'left') {
        if (playerPosition.y !== opponentPosition.y) {
          socket.emit('move_left_pad', playerPosition);
        }
      } else if (playerSide === 'right') {
        if (playerPosition.y !== opponentPosition.y) {
          socket.emit('move_right_pad', playerPosition);
        }
      }

      if (ball.moveY === DIRECTION.UP) ball.y -= (ball.speed / 1.5);
      else if (ball.moveY === DIRECTION.DOWN) ball.y += (ball.speed / 1.5);
      if (ball.moveX === DIRECTION.LEFT) ball.x -= ball.speed;
      else if (ball.moveX === DIRECTION.RIGHT) ball.x += ball.speed;

      if (playerSide === 'left') {
        if (ball.x - ball.width <= playerPosition.x && ball.x >= playerPosition.x - playerPosition.width) {
          if (ball.y <= playerPosition.y + playerPosition.height && ball.y + ball.height >= playerPosition.y) {
            ball.x = (playerPosition.x + ball.width);
            ball.moveX = DIRECTION.RIGHT;
            socket.emit('set_ball_position', { x: ball.x, y: ball.y });
          }
        }
      } else if (playerSide === 'right') {
        if (ball.x - ball.width <= opponentPosition.x && ball.x >= opponentPosition.x - opponentPosition.width) {
          if (ball.y <= opponentPosition.y + opponentPosition.height && ball.y + ball.height >= opponentPosition.y) {
            ball.x = (opponentPosition.x - ball.width);
            ball.moveX = DIRECTION.LEFT;
            socket.emit('set_ball_position', { x: ball.x, y: ball.y });
          }
        }
      }

      if (playerSide === 'left') {
        if (playerPosition.y > ball.y - (playerPosition.height / 2)) {
          if (ball.moveX === DIRECTION.RIGHT) playerPosition.y -= playerPosition.speed / 1.5;
          else playerPosition.y -= playerPosition.speed / 4;
        }
        if (playerPosition.y < ball.y - (playerPosition.height / 2)) {
          if (ball.moveX === DIRECTION.RIGHT) playerPosition.y += playerPosition.speed / 1.5;
          else playerPosition.y += playerPosition.speed / 4;
        }
      } else if (playerSide === 'right') {
        if (opponentPosition.y > ball.y - (opponentPosition.height / 2)) {
          if (ball.moveX === DIRECTION.RIGHT) opponentPosition.y -= opponentPosition.speed / 1.5;
          else opponentPosition.y -= opponentPosition.speed / 4;
        }
        if (opponentPosition.y < ball.y - (opponentPosition.height / 2)) {
          if (ball.moveX === DIRECTION.RIGHT) opponentPosition.y += opponentPosition.speed / 1.5;
          else opponentPosition.y += opponentPosition.speed / 4;
        }
      }
    }

    if (playerSide === 'left' && playerPosition.score === rounds[round]) {
      if (!rounds[round + 1]) {
        over = true;
        socket.emit('end_game', 'win');
        setTimeout(() => {
          endGameMenu('Winner!');
        }, 1000);
      } else {
        color = generateRoundColor();
        playerPosition.score = opponentPosition.score = 0;
        playerPosition.speed += 0.5;
        opponentPosition.speed += 1;
        ball.speed += 1;
        round += 1;
      }
    } else if (playerSide === 'right' && opponentPosition.score === rounds[round]) {
      over = true;
      socket.emit('end_game', 'lose');
      setTimeout(() => {
        endGameMenu('Game Over!');
      }, 1000);
    }
  };

  const draw = () => {
    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    context.fillStyle = color;

    context.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    context.fillStyle = '#ffffff';

    context.fillRect(
      playerPosition.x,
      playerPosition.y,
      playerPosition.width,
      playerPosition.height
    );

    context.fillRect(
      opponentPosition.x,
      opponentPosition.y,
      opponentPosition.width,
      opponentPosition.height
    );

    if (playerSide === 'left' || playerSide === 'right') {
      context.fillRect(
        ball.x,
        ball.y,
        ball.width,
        ball.height
      );
    }

    context.beginPath();
    context.setLineDash([7, 15]);
    context.moveTo((canvas.width / 2), canvas.height - 140);
    context.lineTo((canvas.width / 2), 140);
    context.lineWidth = 10;
    context.strokeStyle = '#ffffff';
    context.stroke();

    context.font = '100px Courier New';
    context.textAlign = 'center';

    context.fillText(
      playerPosition.score.toString(),
      (canvas.width / 2) - 300,
      200
    );

    context.fillText(
      opponentPosition.score.toString(),
      (canvas.width / 2) + 300,
      200
    );

    context.font = '30px Courier New';

    context.fillText(
      'Round ' + (round + 1),
      (canvas.width / 2),
      35
    );

    context.font = '40px Courier';

    context.fillText(
      rounds[round] ? rounds[round].toString() : rounds[round - 1].toString(),
      (canvas.width / 2),
      100
    );
  };

  const loop = () => {
    update();
    draw();

    if (!over) requestAnimationFrame(loop);
  };

  const listen = () => {
    document.addEventListener('keydown', (key) => {
      if (running === false) {
        running = true;
        window.requestAnimationFrame(loop);
      }

      if (key.keyCode === 38 || key.keyCode === 87) {
        playerPosition.move = DIRECTION.UP;
        playerPosition.y -= playerPosition.speed;
        socket.emit('move_left_pad', playerPosition);
      }

      if (key.keyCode === 40 || key.keyCode === 83) {
        playerPosition.move = DIRECTION.DOWN;
        playerPosition.y += playerPosition.speed;
        socket.emit('move_left_pad', playerPosition);
      }
    });

    document.addEventListener('keyup', (key) => {
      playerPosition.move = DIRECTION.IDLE;
      socket.emit('move_left_pad', playerPosition);
    });
  };

  const resetTurn = (victor, loser) => {
    ball = Ball.new(ball.speed);
    victor.score += 1;

    if (playerSide === 'left') {
      socket.emit('score_update', { score_left: playerPosition.score, score_right: opponentPosition.score });
    } else if (playerSide === 'right') {
      socket.emit('score_update', { score_left: opponentPosition.score, score_right: playerPosition.score });
    }

    turn = loser;
    timer = new Date().getTime();
  };

  const turnDelayIsOver = () => {
    return (new Date().getTime() - timer >= 1000);
  };

  const generateRoundColor = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    if (newColor === color) return generateRoundColor();
    return newColor;
  };

  onMount(() => {
    initialize();
  });
</script>

<canvas></canvas>
