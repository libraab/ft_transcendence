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
  let canvasBackgroundColor = "#000"; // Default background color
  let gameStarted = false;
  let gameOver = false;
  let lossCount = 0;

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
    if (lossCount > 0) {
      setTimeout(() => {
        resetGame();
      }, 3000); // Wait for 3 seconds before starting the game again
    } else {
      requestId = requestAnimationFrame(update);
    }
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

  const handleLoss = () => {
    lossCount++;
    if (lossCount >= 3) {
      gameOver = true;
    } else {
      gameStarted = false;
    }
  };
  
  const draw = () => {
    // Clear the canvas
    context.fillStyle = "#000";
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
  };

  const changeBackgroundColor = () => {
    canvasBackgroundColor = "#ff69b4"; // Change background color to pink
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

<canvas id="pong-canvas" width="800" height="400"></canvas>
<button on:click={changeBackgroundColor} style="border-radius: 50%; background-color: pink;">Girly Mode</button>

<style>

  canvas {
    background-color: #000;
    cursor: none;
  }

  #pong-canvas {
    display: block;
    margin: 0 auto;
    width: 90%;
    max-width: 1000px;
    height: auto;
    border: 1px solid #fff;
  }
  button {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    font-size: 16px;
    background-color: #ed4197; /* Change the background color to pink */
    color: rgb(16, 9, 9); /* Set the text color to white */
    border: none; /* Remove the border */
    border-radius: 20px; /* Make the button more round */
    box-shadow: 0 0 20px rgba(58, 18, 38, 0.5); /* Add a glow effect */
  }

</style>