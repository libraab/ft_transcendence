<script>
	export let img_path;
</script>

<header>
	<img src={img_path} alt="logo" class="rick">
	<div class="description">
		<h1>FT_RICKSCENDANCE</h1>
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

	.rick {
		/* display: block; */
		/* margin: 0 auto; */
		width: 150px;
		height: 150px;;
		margin: 30px 0px;
		/* height: auto; */
	}

</style>