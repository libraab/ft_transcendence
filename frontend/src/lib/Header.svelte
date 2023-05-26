<script lang="ts">
	import { imgUser } from '../storable';
</script>

<header>
	<div class="image-container">
		{#if $imgUser != ''}
			<img src={$imgUser} alt="logo" class="rick">
		{/if}
	</div>
	<div class="description" >
		<h1 class="glow-text">FT_TRANSCENDENCE</h1>
		<p class="catch-phrase">A strange adventure into Pong Univers inside an Multiverse inside a jelly jar inside something else and go on ...</p>
	</div>
</header>


<style>
	header {
		background: black no-repeat center/100% url('https://profile.intra.42.fr/assets/background_login-a4e0666f73c02f025f590b474b394fd86e1cae20e95261a6e4862c2d0faa1b04.jpg');
		padding: 20px 200px;
		display: flex;
		justify-content: flex-start;
		position: relative;
		height: 200px;
	}

	.description {
		position: absolute;
		max-width: 500px;
		color: whitesmoke;
		padding: 20px;
		display: flex;
		flex-direction: column;
		justify-content: end;
		top: 50%;
		left: 20%;
		transform: translateY(-50%);
	}

	.catch-phrase {
		font-style: italic;
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

	.glow-text {
		text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
	}
</style>
