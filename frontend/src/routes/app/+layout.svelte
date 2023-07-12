<script lang="ts">
	import { jwt_cookie, img_path, clientName, userId42, userId, rooms } from '$lib/stores';
	import { goto } from '$app/navigation';
	import { onDestroy, onMount } from 'svelte';
	import { io } from 'socket.io-client'
	import { initializeSocket, msgCount, updateCount } from '$lib/socketsbs.js';
	// import { redirect } from '@sveltejs/kit';

	// la socket ICICICICI//
	
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
                    console.log("your fetch was sucessfull");
					const data = await connect.json();
					$img_path = data.img;
					$clientName = data.name;
					$userId = data.id;
					initializeSocket();
                }
                else
                {
                    //connection refusee a cause dun mauvai/vieux/invalid/corrompu cookie
                    console.log("fetch failed in app layout");
                    console.log(connect.status);
					goto("/");
                }
            }
            catch (error) {
                console.error("fetching in '/' :" , error);
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
		$jwt_cookie = "";
		$img_path = "";
		$clientName = "";
		$userId42 = 0;
		goto("/logout");
	}
</script>


<header>
	<div class="image-container">
		<img src={$img_path} alt="logo" class="rick">
		<button class="Log Out" on:click={handleLogOut}>Log Out</button>
	</div>
	<div class="description">
		<h1 class="glow-text">FT_TRANSCENDENCE</h1>
		<p class="catch-phrase">An adventure into Pong Univers inside an Multiverse inside a jelly jar inside something else and go on ...</p>
	</div>
</header>

<div>
	<nav class="tabs">
		<button on:click={ () => goto('/app/dashboard') } >DashBoard</button>
		<button on:click={ () => goto('/app/game') } >Game</button>
		<button on:click={ () => goto('/app/chat') } class:newMessage={msgCount} >Chat</button>
		<button on:click={ () => goto('/app/room') } >Room</button>
	</nav>
</div>

<main>
	<slot class="main_body"></slot>
</main>

<footer>
	<div class="bigup">Transcendental team42 - share like suscribe</div>
</footer>

<style>
	
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
</style>