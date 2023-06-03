<script>
    import { dataset_dev } from "svelte/internal";
	import ConnectStatus from "../shared/connectStatus.svelte";
	export let img_path;
	export let data;

	let id = -1;
	if (data)
		id = data.id;
</script>

<header>
	<div class="image-container">
		<img src={img_path} alt="logo" class="rick">
	</div>
	<ConnectStatus userId={id}/>
	<div class="description">
		<h1 class="glow-text">FT_TRANSCENDENCE</h1>
		<p class="catch-phrase">A strange adventure into Pong Univers inside an Multiverse inside a jelly jar inside something else and go on ...</p>
	</div>
</header>


<style>
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