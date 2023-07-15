<script>
    import { dataset_dev } from "svelte/internal";
	import ConnectStatus from "../shared/connectStatus.svelte";
	import { img_path} from "../lib/storesores";
	export let data;

	let id = -1;
	if (data)
		id = data.id;
</script>

<header>
	<div class="image-container">
		<img src={img_path} alt="logo" class="rick">
	</div>
	<!-- <ConnectStatus userId={id}/> -->
	<div class="description">
		<h1 class="glow-text">FT_TRANSCENDENCE</h1>
		<p class="catch-phrase">A strange adventure into Pong Univers inside an Multiverse inside a jelly jar inside something else and go on ...</p>
	</div>
</header>


<style>
	header {
		background: no-repeat center/100% url('https://profile.intra.42.fr/assets/background_login-a4e0666f73c02f025f590b474b394fd86e1cae20e95261a6e4862c2d0faa1b04.jpg');
		padding: 20px;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}

	.description {
		max-width: 500px;
		color: whitesmoke;
		padding: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		flex-grow: 1;
		overflow-wrap: break-word;
	}

	.catch-phrase {
		font-style: italic;
		margin-top: 10px; 
		font-size: 1.6vw; /* Adjust the value as needed */
	}

	.image-container {
		position: relative;
		flex-grow: 1; /* Allow the image container to grow and fill the remaining space */
		display: flex;
		justify-content: flex-end; /* Align the image to the right */
		align-items: center;
	}
	.rick {
		width: 150px;
		height: 150px;
		border-radius: 50%;
		margin: 0 auto;
		object-fit: cover;
		box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
	}

	.glow-text {
		text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
		font-size: 2.4vw; 
	}

	/* Media query for desktops */
	@media (min-width: 1024px) {
		header {
			padding: 20px 300px;
		}
	}

	/* Media query for small screens */
	@media (max-width: 480px) {
		.glow-text {
			display: none;
		}

		.catch-phrase {
			font-size: 3vw; /* Adjust the value as needed */
		}
	}

	/* Media query to hide "FT_TRANSCENDENCE" on small screens in landscape orientation */
	@media (max-width: 480px) and (orientation: landscape) {
		.glow-text {
			display: none;
		}
	}

</style>