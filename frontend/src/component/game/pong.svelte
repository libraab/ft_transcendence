<script>
	import { onMount, onDestroy } from 'svelte';
	import io from 'socket.io-client';

	let socket;
	let message = '';

	const sendMessage = () => {
		socket.emit(message, { name: 'test' });
		message = '';
	};

	onMount(() => {
		socket = io('http://localhost:3000/pong');

		// Écoutez les événements du serveur
		socket.on('connect', () => {
			console.log('Connecté au serveur Socket.IO');
		});

		socket.on('joinRoom', (data) => {
			console.log(data);
		});

		socket.on('message', (roomId) => {
			console.log(roomId);
		});

		socket.emit('message', { message: 'Hello server!' });
	});

	onDestroy(() => {
		// Déconnectez-vous du serveur Socket.IO lorsque le composant est détruit
		socket.disconnect();
	});
</script>

<h1>Client Socket.IO</h1>

<!-- Champ de saisie pour le message -->
<input type="text" bind:value="{message}" />

<!-- Bouton pour envoyer le message -->
<button on:click="{sendMessage}">Envoyer</button>




<!---
<script>
  import { onMount } from "svelte";

  let canvas;
  let context;
  let requestId; // to add later when real player
  let ballX = 0;
  let ballY = 0;
  let ballSpeedX = 10;
  let ballSpeedY = 4;
  let paddle1Y = 250;
  let paddle2Y = 250;
  const paddleHeight = 100;
  const paddleThickness = 10;
  let gameStarted = false;
  let gameOver = false;
  let girlyMode = false;
  let playerScore = 0;
  let aiScore = 0;

  const calculateMousePos = (event) => {
	const rect = canvas.getBoundingClientRect();
	const root = document.documentElement;
	const mouseX = event.clientX - rect.left - root.scrollLeft;
	const mouseY = event.clientY - rect.top - root.scrollTop;
	return { x: mouseX, y: mouseY };
  };

  const handleMouseClick = () => {
	if (gameOver) {
	  resetGame();
	} else if (!gameStarted) {
	  startGame();
	}
  };
  const resetGame = () => {
	console.log('going crazy here');
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
	ballSpeedX = -3; // Adjust the X-axis speed here
	ballSpeedY = 2; // Adjust the Y-axis speed here
	gameStarted = false;
	gameOver = false;
	requestId = requestAnimationFrame(update);
  };

  const startGame = () => {
	if (gameStarted) return;
	gameStarted = true;
	requestId = requestAnimationFrame(update); //run the camva without moving the ball
  };

  const update = () => {
	move();
	draw();
	requestId = requestAnimationFrame(update); // move the ball when it starts
  };

  const move = () => {
  if (gameOver) return;

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX < 0) {
	if (ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
	  ballSpeedX = -ballSpeedX;
	} else {
	  handleLoss();
	}
  }

  if (ballX > canvas.width) {
	if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
	  ballSpeedX = -ballSpeedX;
	} else {
	  handleLoss();
	}
  }

  if (ballY < 0 || ballY > canvas.height) {
	ballSpeedY = -ballSpeedY;
  }

  // AI-controlled paddle movement
  const paddle2YCenter = paddle2Y + paddleHeight / 2;
	if (paddle2YCenter < ballY - 35) {
	  paddle2Y += 5; // Adjust the AI paddle speed here
	} else if (paddle2YCenter > ballY + 35) {
	  paddle2Y -= 5; // Adjust the AI paddle speed here
	}
  };

  const handleLoss = () => {
	if (ballX < 0) {
	  aiScore++;
	} else {
	  playerScore++;
	}
	if (playerScore === 10 || aiScore === 10) {
	  gameOver = true;
	  playerScore = 0;
	  aiScore = 0;
	  gameStarted = false;
	  startGame();
	}
	else
	  resetGame();
  };

  
  const draw = () => {
	// Clear the canvas
	context.fillStyle = girlyMode ? "#ff69b4" : "#000";
	context.fillRect(0, 0, canvas.width, canvas.height);

	// Draw the paddles
	context.fillStyle = "#fff";
	context.fillRect(0, paddle1Y, paddleThickness, paddleHeight);
	context.fillRect(
	  canvas.width - paddleThickness,
	  paddle2Y,
	  paddleThickness,
	  paddleHeight
	  );
	  
	  // Draw the ball
	  context.fillStyle = "#fff";
	  context.beginPath();
	  context.arc(ballX, ballY, 10, 0, Math.PI * 2, true);
	  context.fill();
  

	// Draw the scores
	const playerScoreElement = document.getElementById("player-score");
	const aiScoreElement = document.getElementById("ai-score");
	playerScoreElement.textContent = playerScore.toString();
	aiScoreElement.textContent = aiScore.toString();

	// Draw game over message if the game is over
	if (gameOver) {
	  context.font = "bold 50px Arial";
	  context.fillStyle = "#fff";
	  context.textAlign = "center";
	  context.fillText("Game Over", canvas.width / 2, canvas.height / 2);
	}
	
 };

  onMount(() => {
	canvas = document.getElementById("pong-canvas");
	context = canvas.getContext("2d");

	canvas.addEventListener("mousemove", (event) => {
	  const mousePos = calculateMousePos(event);
	  paddle1Y = mousePos.y - paddleHeight / 2;
	});

	canvas.addEventListener("mousedown", handleMouseClick);

  });
</script>
<div id="game-container">
  <div id="player-score">0</div>
  <canvas id="pong-canvas" width="1000" height="600" on:click={handleMouseClick}></canvas>
  <div id="ai-score">0</div>
</div>
<button on:click={() => girlyMode = !girlyMode}>Girly Mode</button>

<style>

#game-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

#player-score {
  font-size: 100px;
  font-weight: bold;
  color: rgb(6, 6, 6);
  margin-left: 200px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

#ai-score {
  font-size: 100px;
  font-weight: bold;
  color: rgb(6, 6, 6);
  margin-right: 200px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

#pong-canvas {
  border: 1px solid #fff;
}

button {
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #ed4197;
  color: rgb(16, 9, 9); 
  border: none; 
  border-radius: 20px; 
  box-shadow: 0 0 20px rgba(58, 18, 38, 0.5);
}

</style>
-->