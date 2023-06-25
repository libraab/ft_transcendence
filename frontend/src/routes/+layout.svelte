
<script>
	import { img_path } from "../stores";
</script>


<header>
	<div class="image-container">
		<img src={$img_path} alt="logo" class="rick">
	</div>
	<a href="/">&#8592; my profile</a>
	<div class="description">
		<h1 class="glow-text">FT_TRANSCENDENCE</h1>
		<p class="catch-phrase">A strange adventure into Pong Univers inside an Multiverse inside a jelly jar inside something else and go on ...</p>
	</div>
	<div>
		<nav class="tabs">
		<!--	<a href="/" on:click|preventDefault={show_page} class:active={$page_shown == "/"}>DashBoard</a>
			<a href="game" on:click|preventDefault={show_page} class:active={$page_shown == "game"}>Game</a>
			<a href="chat" on:click|preventDefault={show_page} number={newMessage} class:active={$page_shown == "chat"} class:newMessage={newMessage}>Chat</a>
			<a href="room" on:click|preventDefault={show_page} class:active={$page_shown == "room"}>Room</a>	
		-->
			<a href="dashboard">DashBoard</a>
			<a href="game">Game</a>
			<a href="chat">Chat</a>
			<a href="room">Room</a>	
		</nav>
	</div>
</header>

<main>
	<!--page content-->
	<slot></slot>
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
	a{
		position: relative;
		text-decoration: none;
		color: rgb(148, 146, 193);
		text-align: center;
		width: 120px;
		margin: 5px 20px;
		list-style-type: none;
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