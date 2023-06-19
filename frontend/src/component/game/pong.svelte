<script>
    import { onDestroy, onMount } from "svelte";
	import { defineGameSocketEvents, getSocket } from "../../socket";
  
	export let socket;;

    let gameState;
  /*
    async function getGameState() {
      const response = await fetch("http://localhost:3000/game");
      gameState = await response.json();
    }
  
    async function updateGameState() {
      const response = await fetch("http://localhost:3000/game", {
        method: "POST"
      });
      const data = await response.json();
      if (data.winner) {
        alert(data.winner === 1 ? "You win!" : "You lose!");
      }
      gameState = data.gameState;
    }
  */
    onMount(async () => {
  //    await getGameState();
 //     setInterval(updateGameState, 1000 / 50);

	  defineGameSocketEvents();
    });

	onDestroy(() => {
//		deleteGameSocketEvents();
	});

    let canvas;
    let ctx;
  /*
    function drawRect(x, y, w, h, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    }
  
    function drawArc(x, y, r, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
    }
  
    function drawNet() {
      for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(gameState.net.x, gameState.net.y + i, gameState.net.width, gameState.net.height, gameState.net.color);
      }
    }
  
    function drawText(text, x, y) {
      ctx.fillStyle = "#FFF";
      ctx.font = "75px fantasy";
      ctx.fillText(text, x, y);
    }
  
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      drawText(gameState.user.score, canvas.width / 4, canvas.height / 5);
  
      drawText(gameState.com.score, 3 * canvas.width / 4, canvas.height / 5);
  
      drawNet();
  
      drawRect(gameState.user.x, gameState.user.y, gameState.user.width, gameState.user.height, gameState.user.color);
  
      drawRect(gameState.com.x, gameState.com.y, gameState.com.width, gameState.com.height, gameState.com.color);
  
      drawArc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, gameState.ball.color);
    }
  
    onMount(() => {
      canvas = document.getElementById("pong");
      ctx = canvas.getContext("2d");
      setInterval(render, 1000 / 60);
    });
*/
	function dummyft()
	{
		socket.game.emit('test', 'random');
	}

</script>
  
<main>
	<button on:click={ ()=> dummyft() }>test</button>
</main>
<!-- <script>
	import { onMount, onDestroy } from 'svelte';
	import io from 'socket.io-client';

	export let id;
	let socket;
	let padPos = 50;
	let mvt = 5;
	let speed = 2.5;
	let otherPad = 50;
	let ballPosx = 800 / 2;
	let ballPosy = 400 / 2;
	let lobby = [];

	onMount(() => {
		socket = io('http://localhost:3000/pong');

		// Écoutez les événements du serveur
		socket.on('connect', () => {
			console.log('Connecté au serveur Socket.IO');
			socket.emit('userId', id);
			socket.emit('lobby')
		});

		socket.on('joinRoom', (data) => {
			console.log(data);
		});

		socket.on('posUpdate', (newPos) =>{
			otherPad = newPos;
		});

		socket.on('lobbyStatus', async (data) => {
			lobby = data;
		})

		document.addEventListener('keydown', handleKeyDown);
	});

	onDestroy(() => {
		socket.disconnect();
	});

	const handleKeyDown = (event) => {
		if (event.key === 's')
		{
			if (padPos + (mvt * speed) >= 400 - 80 )
				padPos = 400 - 80;
			else
				padPos += mvt * speed;
		}
		else if (event.key === 'z')
		{
			if (padPos - (mvt * speed) <= 0)
				padPos = 0
			else
				padPos -= mvt * speed;
		}
		socket.emit('pads', padPos);
	};

//socket.emit('lobby');
</script>

<div class="game-container">
	<div class="game">
		<div class="pad left-pad" style="top: {padPos}px;"></div>
		<div class="pad right-pad" style="top: {otherPad}px;"></div>
		<div class="ball" style="top: {ballPosy}px; left: {ballPosx}px;"></div>
	</div>
	<div>
		{#each lobby as item}
			<div>{item}</div>
			<button>Challenge</button>
		{/each}
	</div>
</div>


<style>
	.game-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 60vh;
	}

	.game {
		position: relative;
		width: 800px;
		height: 400px;
		border: 1px solid black;
	}

	.pad {
		position: absolute;
		width: 20px;
		height: 80px;
		background-color: black;
	}

	.left-pad {
		left: 10px;
	}

	.right-pad {
		right: 10px;
	}

	.ball {
		position: absolute;
		width: 10px;
		height: 10px;
		background-color: red;
	}
</style> -->
