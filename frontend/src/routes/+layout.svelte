<script lang="ts">
	import { img_path } from "../stores";
	import { goto } from '$app/navigation';

</script>


<header>
	<div class="image-container">
		<img src={$img_path} alt="logo" class="rick">
	</div>
	<div class="description">
		<h1 class="glow-text">FT_TRANSCENDENCE</h1>
		<p class="catch-phrase">A strange adventure into Pong Univers inside an Multiverse inside a jelly jar inside something else and go on ...</p>
	</div>
</header>

<div>
	<nav class="tabs">
		<button on:click={ () => goto('/dashboard') } >DashBoard</button>
		<button on:click={ () => goto('/game') } >Game</button>
		<button on:click={ () => goto('/chat') } >Chat</button>
		<button on:click={ () => goto('/room') } >Room</button>
	</nav>
</div>

<main>
	<a href="/" style="color: black;">&#8592; my profile</a>
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
</style>