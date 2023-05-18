<script>
  import { onMount } from "svelte";

  let canvas;
  let context;
  let requestId;
  let ballX = 50;
  let ballY = 50;
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

  // const toggleGirlyMode = () => {
  //   girlyMode = !girlyMode;
  //   canvas.style.backgroundColor = girlyMode ? "#ff69b4" : "#000";
  // };

  const handleMouseClick = () => {
    if (gameOver) {
      resetGame();
    } else if (!gameStarted) {
      startGame();
    }
  };
  // const handleMouseClick = () => {
  //   if (!gameStarted) {
  //     startGame();
  //   }
  // };

  const resetGame = () => {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -3; // Adjust the X-axis speed here
    ballSpeedY = 2; // Adjust the Y-axis speed here
    gameStarted = false;
    gameOver = false;
    requestId = requestAnimationFrame(update);
  };

  // const startGame = () => {
  //   if (gameStarted) return;
  //   gameStarted = true;
  //   if (playerScore === 10 || aiScore === 10) {
  //     // Reset scores for a new game
  //     playerScore = 0;
  //     aiScore = 0;
  //   }
  //   requestId = requestAnimationFrame(update);
  // };

  const startGame = () => {
    if (gameStarted) return;
    gameStarted = true;
    requestId = requestAnimationFrame(update);
  };

  const update = () => {
    move();
    draw();
    requestId = requestAnimationFrame(update);
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
      paddle2Y += 6; // Adjust the AI paddle speed here
    } else if (paddle2YCenter > ballY + 35) {
      paddle2Y -= 6; // Adjust the AI paddle speed here
    }
  };

  // const handleLoss = () => {
  //   if (ballX < 0) {
  //     // Player lost
  //     aiScore++;
  //   } else {
  //     // AI lost
  //     playerScore++;
  //   }

  //   if (playerScore === 10 || aiScore === 10) {
  //     // Game over when either player reaches 10 points
  //     gameOver = true;
  //   } else {
  //     // Continue the game
  //     gameStarted = false;
  //   }
  // };

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

    startGame();
  });

</script>

<div id="game-container">
  <div id="player-score">0</div>
  <canvas id="pong-canvas" width="800" height="400"></canvas>
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