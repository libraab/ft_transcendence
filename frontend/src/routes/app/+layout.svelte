<script lang="ts">
	import { jwt_cookie, img_path, clientName, userId42, userId, rooms } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import { io } from 'socket.io-client'
	import { initializeSocket, msgCount, socket } from '$lib/socketsbs.js';
	import { connectClientToColyseus } from '$lib/gamesocket';
	import Alert from '$lib/popupAlert.svelte'
	// import { redirect } from '@sveltejs/kit';

	// la socket ICICICICI//
	
	let local_count = msgCount;

	/**
	 * Invitations
	*/
	let alertPopupOn = false;
	let invitationData =  {player_id: 0, secret: "", name: "", img: ""};

	
	let setPopupToogleEvent = () =>
	{
		socket.on('invitationGame', invitationHandler);
	}
	
	let invitationHandler = (invitData) =>
	{
		console.log("invitation!!!");
		alertPopupOn = true;
		invitationData = invitData;
		//alert("Some guy invited you to a game!");
	}

	/**
	 * La logique de ce Layout qui englobe tout App
	 * On fait un fetch 'test' et on recupere chaque info necessaire quon stock dans stores et dans le localStorage en consequent
	 * Si nok alors lacces a l'app est interdite et on renvoi sur la page de debut
	*/
	onMount( async () =>
    {
		if ($jwt_cookie)
        {
            try {
                const connect = await fetch(`/api/dashboard`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${$jwt_cookie}`
                    }
                });
                if (connect.status == 200)
                {
					const data = await connect.json();
					$img_path = data.img;
					$clientName = data.name;
					$userId = data.id;
					await initializeSocket();
					setPopupToogleEvent();
					// connectClientToColyseus();
                }
                else
                {
                    //connection refusee a cause dun mauvai/vieux/invalid/corrompu cookie
                    console.error("fetch failed in app layout");
					goto("/");
                }
            }
            catch (error) {
                console.error("fetching in '/app' :" , error);
				goto("/");
            }
        }
    })

	onDestroy(() =>
	{

	});

	/**
	 * La fonction handleLogOut est appelee lorsque le user click sur le bouton LogOut
	 * Ce qu'on doit faire cest supprimer tous les localStorage et les cookies de la session
	 * Puis renvoyer la session en "/"
	 */
	let handleLogOut = () => {

		goto("/logout");
	}

	/**
	 * Search Block
	 */
	let nameSearchInput = "";
	let id42NameInputNotEmpty: any;
	let searchRes: any = [];
	async function getSpecifiedClients()
	{
		// const retName = document.getElementById('id42-name-input').value;
		id42NameInputNotEmpty = nameSearchInput.trim() !== '';

		if (id42NameInputNotEmpty)
		{
			try
			{
				const response = await fetch(`/api/dashboard/name/${nameSearchInput}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${$jwt_cookie}`
                    }
                });
				searchRes = await response.json();
			}
			catch (error) {
				console.error(error);
			}
		}
		else
			searchRes = [];
	}

	$:{
		$rooms;
		local_count = msgCount;
	}

	
</script>


<header>
	<div class="image-container">
		<img src={$img_path} alt="logo" class="rick">
		<button class="Log Out" on:click={handleLogOut}>Log Out</button>
	</div>
	<div class="description">
		<h1 class="glow-text">FT_TRANSCENDENCE</h1>
		<p class="catch-phrase">A strange adventure into Pong Univers inside an Multiverse inside a jelly jar inside something else and go on ...</p>
	</div>
</header>

<div>
	<nav class="tabs">
		<button on:click={ () => goto('/app/dashboard') } >DashBoard</button>
		<button on:click={ () => goto('/app/game') } >Game</button>
		<button on:click={ () => goto('/app/chat') } number={local_count} class:newMessage={local_count}>Chat</button>
		<button on:click={ () => goto('/app/room') } >Room</button>
		<div class="profile-container">
			<div>
				<label for="id42-name-input">search by Name:</label>
				<input type="text" id="id42-name-input" on:input={() => getSpecifiedClients()} bind:value={nameSearchInput}/>
				
				<div class="popup_container">
					{#if id42NameInputNotEmpty}
						<div class="popup">
							{#each searchRes as client}
								<div class="link">
									<a href='/app/dashboard/{client.name}'>{client.name}</a>
										<!-- on:click={() => fetchTarget(client.name)} -->
										<!-- on:click={() => refreshInput(client)}>{client.name}</a> -->
								</div>
							{/each}
						</div>
					{/if}
				</div>
	
			</div>
		</div>
	</nav>
</div>

<main>
	{#if alertPopupOn}
		<Alert invitationData={invitationData}/>
	{/if}
	<slot class="main_body"></slot>
</main>

<footer>
	<div class="bigup">Transcendental team42 - share like suscribe</div>
</footer>

<style>
	:global(body) 
    {
        margin: 0 0 0 0;
        padding: 0 0 0 0;
    }

	footer{
		text-align: center;
	}
	.bigup{
		color: #aaa;
		font-size: 14px;
		display: inline-block;
		padding: 10px;
		border-top: 1px solid #ddd;
	}
	.tabs{
		display: flex;
		justify-content: space-around;
		padding: 0 150px;
		margin: 0;
		background-color: #292d39;
		color: lightgray
	}
	button{
		position: relative;
		text-decoration: none;
		color: rgb(148, 146, 193);
		text-align: center;
		width: 120px;
		margin: 5px 20px;
		list-style-type: none;
		background: none;
		border: none;
		cursor: pointer;
	}
	.image-container {
		position: relative;
	}
	.rick {
		width: 150px;
		height: 150px;
		border-radius: 50%;
		margin-right: 20px;
		object-fit: cover;
		box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
	}
	.main_body {
		/* height: 50vh; 33% de la hauteur de la fenêtre */
		width: 100%; /* 100% de la largeur de la fenêtre */
		/* background: url('path/to/img.png') center/cover no-repeat, blue; */

		/* color: white; */
		margin: 0 auto;
		font-size: 6px;
		font-size: 1vw;
	}
	header {
		background: no-repeat center/100% url('https://profile.intra.42.fr/assets/background_login-a4e0666f73c02f025f590b474b394fd86e1cae20e95261a6e4862c2d0faa1b04.jpg');
		padding: 20px 200px;
		display: flex;
		justify-content: flex-start;
	}
	.description {
		max-width: 500px;
		color: whitesmoke;
		padding: 20px;
		display: flex;
		flex-direction: column;
		justify-content: end;
	}
	.catch-phrase {
		font-style: italic;
	}
	.image-container {
		position: relative;
	}
	.glow-text {
		text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
	}

	.newMessage::after {
		content: attr(number);
		position: absolute;
		top: -10px;
		right: -10px;
		width: 20px;
		height: 20px;
		background-color: red;
		color: white;
		border-radius: 50%;
		text-align: center;
		line-height: 20px;
		font-size: 12px;
	}
	.link {
		text-decoration: none;
		transition: background-color 0.3s ease;
	}
	.link:hover {
		background-color: #f0f0f0; /* Couleur de fond grisé */
	}
	.profile-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
  	}
	.popup_container {
		position: relative; /* Ajout du positionnement relatif */
		width: 7vw;
		left: 50%;
		transform: translateX(-50%);
	}
	.popup {
		position: absolute;
		top: calc(100% + 10px); /* Positionnement en dessous de l'input */
		left: 0;
		width: 100%;
		max-height: 200px;
		overflow-y: auto;
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		z-index: 1; /* Assure que la fenêtre contextuelle est au-dessus des autres éléments */
	}
	.button-container {
		display: flex;
		gap: 20px;
		margin-right: 20px;
	}

	.button-profile {
		padding: 10px 20px;
		border: none;
		border-radius: 20px;
		font-size: 16px;
		background-color: #4caf50;
		color: white;
		cursor: pointer;
	}

	.button-profile:hover {
		background-color: #45a049;
	}
	
	.button-profile:focus {
		outline: none;
  		box-shadow: 0 0 0 2px #4caf50;
	}

	.profile-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
  	}

	.shiny-text {
		display: inline-block;
		font-size: 36px; /* Increase the font size to make it bigger */
		font-family: "Arial", sans-serif; /* Apply a specific font */
		color: #333; /* Set a desired font color */
		text-shadow: none; /* Remove the text shadow */
	}

	.container {
		height: 100%; /* occupe 100% de la hauteur de main_body */
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	.popup_container {
		position: relative; /* Ajout du positionnement relatif */
		width: 7vw;
		left: 50%;
		transform: translateX(-50%);
	}
	.popup {
		position: absolute;
		top: calc(100% + 10px); /* Positionnement en dessous de l'input */
		left: 0;
		width: 100%;
		max-height: 200px;
		overflow-y: auto;
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		z-index: 1; /* Assure que la fenêtre contextuelle est au-dessus des autres éléments */
	}
	.popup-button {
		display: block;
		width: 100%;
		margin-bottom: 8px;
	}

	.avatar {
		width: 130px;
		height: 130px;
		border-radius: 60%;
		overflow: hidden;
		margin-top: 20px;
	}

	.avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.round-button {
		border: none;
		background-color: #9e9c9c;
		border-radius: 20px;
		color: white;
		font-size: 16px;
		font-weight: bold;
		cursor: pointer;
		outline: none;
		padding: 10px 20px;
		margin: 10px;
		transition: background-color 0.3s ease;
	}

	.round-button:hover {
		background-color: #464947;
	}

	.round-button:active {
		transform: scale(0.95);
	}

	.dfa-button.active {
		background-color: green;
	}

	.dfa-button.inactive {
		background-color: red;
	}

	.block-button.inactive {
		background-color: red;
	}
	.image-container {
		position: relative;
	}
	.rick {
		width: 150px;
		height: 150px;
		border-radius: 50%;
		margin-right: 20px;
		object-fit: cover;
		box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
	}
</style>