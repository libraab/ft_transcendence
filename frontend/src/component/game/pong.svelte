<script>
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
</style>
