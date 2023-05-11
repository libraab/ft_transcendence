<script>
	export let deletePop;
</script>

{#if deletePop}
	<div class="backdrop" on:click|self on:keypress>
		<div class="modal">
			<h1>Plz stay...</h1>>
			<p>we can work this out</p>
			<p>i know its me, not you</p>
			<p>you know it's kinda hard for me right now</p>
			<p>but i can change</p>
			<p>i ll be better i promise</p>
			<p>i love u</p>
		</div>
	</div>
{/if}

<style>
	.backdrop {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.8);
	}
	.modal {
		padding: 10px;
		border-radius: 10px;
		max-width: 400px;
		margin: 10% auto;
		text-align: center;
		background: white;
	}
	.modal h1 {
		color: black; /* ou une autre couleur de votre choix */
	}
	.modal p {
		color: black; /* ou une autre couleur de votre choix */
	}

</style>
