<script lang="ts" >
    import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { game_mode } from '$lib/stores';
	import { Client } from 'colyseus.js'
	// import { client, connectClientToGame } from '$lib/gamesocket'

	let matches: any;
	//let width: any;
	//let height: any;
	let client: any;
	let name: any;
	let input: string;
	let initialScreen: any;
	let canvas: any;
	let ctx: any;
	let game: any;
	let pong: any;
	let room: any;
	let matchroom: any;
	let gameActive: boolean = false;
	let promise: any;
	let gameCode: any;
	let playerNumber: number;
	let changecolor: boolean = false;
	if (browser) {
		client = new Client("ws://" + location.hostname + ":3001/ws");
	}
	
	// if (browser){
		// }
		
		
		async function createGame() {
			try {
				// console.log(localstorage);
			if(browser)
			{
				const localstorage =  localStorage.getItem('userId');
				room = await client?.joinOrCreate("my_room", {id: localstorage}); // this will create "my_room" if it doesn't exist already or join it if it does exist
			}
			name = room.id;
			return room.id;
		} catch(e) {
			console.error(e);
		}
	}

	const handleCreateGame = () => {
		promise = createGame();
	}

	async function joinGame() {
		try {
			if(browser)
			{
				const localstorage =  localStorage.getItem('userId');
				// input = (<HTMLInputElement>document.getElementById('gameCodeInput')).value;
				room = await client?.joinById(input, {id: localstorage});
			}
		} catch(e) {
			console.error(e);
		}
	}

	const handleJoinGame = () => {
		promise = joinGame();
	}
	
	function init() {
    initialScreen.style.display = "none";
    game.style.display = "block";
    canvas = document.getElementById('pong');
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');
    gameCode = document.getElementById('gameCode');
    if (gameCode) {
        gameCode.innerText = name;
    }
    gameActive = true;
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);
}

	function keydown(e: any) {
		(e.keyCode);
		if (e.keyCode === 38) {
			if (playerNumber == 1)
				room.send("keydown38player1");
			else
				room.send("keydown38player2");
		}
		if (e.keyCode === 40) {
			if (playerNumber == 1)
				room.send("keydown40player1");
			else
				room.send("keydown40player2");
		}
	}

	function keyup(e: any) {
		if (e.keyCode === 38) {
			if (playerNumber == 1)
				room.send("keyup38player1");
			else
				room.send("keyup38player2");
		}
		if (e.keyCode === 40) {
			if (playerNumber == 1)
				room.send("keyup40player1");
			else
				room.send("keyup40player2");
		}
	}

	const initGame = () => {
		// room?.send("init");
		promise = init();
	}

	$: if (room) {
		room.onMessage("init", (j: number) => {
			playerNumber = j;
		});
		room.onMessage("gameState", (gameState: any) => 
		{
			gameState = JSON.parse(gameState);
    		requestAnimationFrame(() => trender(gameState));
		});
		room.onMessage("gameOver", (data: any) => {
			let date = JSON.parse(data);
    		if (date.winner === playerNumber) {
				const result = confirm("You Win !!");
				//console.log(result);
				if(result)
				{
					//alert('You win!');
					goto("/app/dashboard");
				}
				
    		}
    		else {
				alert('You lose!');
				goto("/app/dashboard");
    		}
			});
			//room.send("canvas", 1000);
		}

		$: if (matchroom) {
			matchroom.onMessage("seat", (ticket: any) => {
				consumeticket(ticket);
			});
		}
		
		async function consumeticket(ticket : any) {
			try {
				  room = await client?.consumeSeatReservation(ticket.ticket);
				} catch (e) {
					  console.error("join error", e);
				}
		}

		/*
			faire changer la taille du canvas.
			envoyer dans le back tout le temps la taille du canvas !
			dans le back recuperer la taille du canvas et faire les calculs dynamique.
		*/
	

	//function setupMessageHandlers() {
		// room?.onMessage("gameState", handleGameState);
		// room?.onMessage("gameCode", handleGameCode);
		// room?.onMessage("unknownCode", handleUnknownCode);
		// room?.onMessage("tooManyPlayers", handleTooManyPlayers);
		// room?.onMessage("playerNumber", handlePlayerNumber);
	//}
	
	// room?.onMessage("init2", () => {
	// });


// function drawRect(x: number, y: number, w: number, h: number, color: any) {
//     ctx.fillStyle = color;
//     ctx.fillRect(x, y, w, h);
// }

function drawRect(x: number, y: number, w: number, h: number, color: any) {
    if (ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    }
}

function drawArc(x: number, y: number, r: number, color: any) {
    if (ctx) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
}


function drawNet(statenet: any, color: any) {
    for (let i = 0; i <= canvas.height; i += 15) {
//        drawRect(statenet.net.x, statenet.net.y + i, statenet.net.width, statenet.net.height, statenet.net.color);
		drawRect(statenet.net.x, statenet.net.y + i, statenet.net.width, statenet.net.height, color);

    }
}

function drawText(text: string, x: number, y: number, color: any) {
    if (ctx) {
        //ctx.fillStyle = "#FFF";
		ctx.fillStyle = color;
        ctx.font = "75px fantasy";
        ctx.fillText(text, x, y);
    }
}


function trender(state: any) {
	if (changecolor === false)
		drawRect(0, 0, canvas.width, canvas.height, "#000");
	else
    	drawRect(0, 0, canvas.width, canvas.height, "#FFF");

	//if (changecolor === true)
    	drawText(state.user.score, canvas.width / 4, canvas.height / 5, "#FF0000");
	//else

    	drawText(state.com.score, 3 * canvas.width / 4, canvas.height / 5, "#FF0000");
	if (changecolor === false)
    	drawNet(state, "#FFF");
	else
		drawNet(state, "#000");

	if (changecolor === false)
		drawRect(state.user.x, state.user.y, state.user.width, state.user.height, "#FFF");
	else
    	drawRect(state.user.x, state.user.y, state.user.width, state.user.height, "#000");

    //drawRect(state.user.x, state.user.y, state.user.width, state.user.height, state.user.color);

	if (changecolor === false)
		drawRect(state.com.x, state.com.y, state.com.width, state.com.height, "#FFF");
	else
   		drawRect(state.com.x, state.com.y, state.com.width, state.com.height, "#000");

	if (changecolor === false)
    	drawArc(state.ball.x, state.ball.y, state.ball.radius, "#FFF");
	else
		drawArc(state.ball.x, state.ball.y, state.ball.radius, "#000");
}

function handleGameState(gameState: any) {
    if (!gameActive) {
        return;
    }
    gameState = JSON.parse(gameState);
    requestAnimationFrame(() => trender(gameState));
}

async function joinMatchMaking() {
	try {
		if(browser)
		{
			const localstorage =  localStorage.getItem('userId');
			matchroom = await client?.joinOrCreate("matchMaking", {id: localstorage} ); // this will create "my_room" if it doesn't exist already or join it if it does exist
			return (matchroom);
		}
	} catch(e) {
		console.error(e);
	}
}

function matchMaking() {
	promise = joinMatchMaking();
	initGame()
}

function changeColor() {
	changecolor = true;
	console.log('change color');
}

</script>

{#await promise}
	<p>attente</p>
{:then test} 
	<!--<button on:click={initGame}>init game</button>-->
{:catch err}
	<p>error: {err}</p>
{/await}

<main>
	<body>
	<div bind:this={initialScreen} class="h-100 center-div">
        <div class="d-flex flex-column align-items-center justify-content-center h-100">
            
			
			<h1>Multiplayer Pong Game</h1>
            <!-- <button on:click={handleCreateGame} class="btn btn-success" id="newGameBtn">
                Create New Game
            </button>
            <div>OR</div>
            <div class="form-group">
				<input bind:value={input} placeholder="enter your name" />
            </div>
            <button on:click={handleJoinGame} class="btn btn-success" id="joinGameBtn">
                Join Game
            </button> -->
			<button on:click={matchMaking} class="btn btn-success" id="matchMaking">
				Match Making
			</button>
			<form method="post" id="form">
				<input type="radio" on:click={changeColor}> night mode
			</form>
        </div>
    </div>
    <div bind:this={game} id="game">

			<!-- <h1>Your game code is: <span id="gameCode"></span></h1> -->

			<canvas bind:this={canvas} id="pong" width=600 height=400></canvas>
    </div>
	</body>
</main>

<style>
	#game {
            display: none;
        }
	body {
            background-color: rgb(255, 255, 255);
        }

        #pong {
            border: 2px solid rgb(32, 31, 31);
            position: relative;
            margin: auto;
            /* top: 0;
            right: 0;
            left: 0;
            bottom: 0; */
			display: flex; 
    		justify-content: center;
   		 	align-items: center;
        }
	h1	{
		color: rgb(28, 99, 88);
		position: center;
		display: flex; 
    	justify-content: center;
   		align-items: center;

	}
	button {
		display: flex; 
    	justify-content: center;
   		align-items: center;
		border: none;
		background-color: #9e9c9c;
		border-radius: 20px;
		color: white;
		font-size: 16px;
		font-weight: bold;
		cursor: pointer;
		outline: none;
		padding: 10px 20px;
		margin: 0 auto;
		transition: background-color 0.3s ease;
	}

	#form {
		margin: 40px;
		display: flex; 
		justify-content: center;
   		align-items: center;
	}

	.center-div {
        display: flex;
        justify-content: center;
        align-items: center;
    }
	
		/*@media (min-width: 1px) and (max-width: 1000px) {
			canvas {
				width: 600px;
				height: 400px;
			}
		}

		@media(min-width: 1001px) {
			canvas {
				width: 1200px;
				height: 800px;
			}
		}*/
</style>


<!-- 
	EXPLICATION DANS LE DETAIL DU CODE DE LA PAGE :

	1. On importe les modules nécessaires à la page :
		- Client de colyseus pour se connecter au serveur
		- onMount pour lancer une fonction au chargement de la page

	2. On déclare les variables nécessaires à la page :
		- client : le client de colyseus
		- name : le nom de la room
		- input : l'input de l'utilisateur
		- initialScreen : l'écran d'accueil
		- canvas : le canvas du jeu
		- ctx : le contexte du canvas
		- game : la div du jeu
		- pong : le canvas du jeu
		- room : la room
		- gameActive : booléen pour savoir si le jeu est actif ou non
		- promise : la promesse de la fonction init
		- gameCode : le code de la room
		- playerNumber : le numéro du joueur

	3. On initialise le client de colyseus au chargement de la page 
	( onMount(async () => { client = await Client.connect('ws://localhost:2567'); }); )

	4. On déclare les fonctions nécessaires à la page :
		- createGame : créer une room
		- joinGame : rejoindre une room
		- init : initialiser le jeu
		- drawRect : dessiner un rectangle
		- drawArc : dessiner un cercle
		- drawNet : dessiner le filet
		- drawText : dessiner du texte
		- trender : dessiner le jeu
		- handleGameState : gérer l'état du jeu

	5. On déclare les fonctions qui seront appelées par les boutons :
		- handleCreateGame : créer une room
		- handleJoinGame : rejoindre une room
		- initGame : initialiser le jeu

	6. On déclare le code HTML de la page :
		- await promise : on attend que la promesse soit résolue
		- then : on affiche le bouton pour initialiser le jeu
		- main : on déclare le contenu de la page
		- body : on déclare le contenu du body
		- div : on déclare le contenu de la div
		- button : on déclare le contenu du bouton
		- canvas : on déclare le contenu du canvas
		- style : on déclare le contenu du style
	
	7. On déclare le style de la page :
		- body : on déclare le style du body
		- pong : on déclare le style du canvas

	8. On déclare le script de la page :
		- onMount : on initialise le client de colyseus au chargement de la page
		- createGame : on créer une room
		- joinGame : on rejoint une room
		- init : on initialise le jeu
		- drawRect : on dessine un rectangle
		- drawArc : on dessine un cercle
		- drawNet : on dessine le filet
		- drawText : on dessine du texte
		- trender : on dessine le jeu
		- handleGameState : on gère l'état du jeu

	
 -->