<script>
	import { hostname } from "../hostname";
	export let ranksTab;

	let classment = [];

	async function getClientStatsOrdered() {
		try {
			const response = await fetch(`http://${hostname}:3000/dashboard/ranking`)
			if (response)
			{
				classment = await response.json();
			}
			else
				classment = [];
		}
		catch (error) {
			console.error(error);
		}
	}
</script>

{#if ranksTab}
	{#await getClientStatsOrdered()}

		<div class="backdrop" on:click|self on:keypress>
			<p>Loading...</p>
		</div>
  	{:then}
		<div class="backdrop" on:click|self on:keypress>

			<div class="modal">
				<h1>Ranking</h1>
				{#if classment.length !== 0}
					{#each classment as score}
						<pre>{JSON.stringify(score, null, 0)}</pre>
					{/each}
				{:else}
					<p>nobody has played yet</p>
					<p>please stay</p>
					<p>share with your friends</p>
					<p>don't leave</p>
					<p>love us</p>
					<p>give us a chance</p>
					<p>pong is not that bad</p>
					<p>i'll be better i promise...</p>
					⠀⠀⠀⠀⠀⠀⠀⠀⢀⠠⠄⠒⠒⠉⠉⠉⠉⠉⠓⠂⠤⢀⠀⠀⠀⠀⠀⠀⠀⠀
					⠀⠀⠀⠀⠀⢀⠄⠊⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠢⢄⠀⠀⠀⠀⠀
					⠀⠀⠀⢀⠔⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠑⢄⠀⠀⠀
					⠀⠀⡰⠁⠀⠀⠀⠀⠀⣀⣀⣀⡀⠀⠀⠀⠀⠀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠢⠀⠀
					⠀⡐⠀⠀⠀⢀⣤⣶⣿⣿⣿⣿⣿⣦⠀⠀⣰⣾⣿⣿⣿⣿⣷⣦⣄⠀⠀⠀⠱⠀
					⡰⠀⠀⢀⣴⣿⠟⠉⢈⠟⠁⢹⣿⣿⡇⢀⣿⠟⠁⠀⡬⠛⣿⣿⣿⣷⣄⠀⠀⢡
					⡇⠀⣠⣿⡿⠁⠀⠀⢎⠀⢀⣼⣿⣿⡇⢸⠏⠀⠀⠘⠀⣰⣿⣿⣿⣿⣿⣦⠀⢸
					⡇⢠⠃⡿⠁⠀⠀⠀⠀⣷⣿⣿⣿⣿⡿⢸⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⡆⢧⢸
					⡇⡞⠀⡇⠀⠀⠀⠀⣰⣿⣿⣿⣿⣿⡇⢸⣆⡀⠀⢀⣼⣿⣿⣿⣿⣿⣿⡇⢸⢸
					⡇⢧⠀⢷⣄⣀⣀⣴⣿⣿⣿⣿⣿⣿⡇⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁⢸⢸
					⢰⠸⡄⠘⣿⡟⠻⣿⣿⣿⣿⣿⣿⡿⠁⠀⢻⣿⡉⠙⣿⣿⣿⣿⣿⣿⡏⠀⡞⡸
					⠀⢂⠹⣄⠘⣧⣠⣾⣿⡿⢿⣣⡿⠁⠀⠀⠀⠻⣿⣿⢿⡿⢟⣾⣿⠏⢀⠜⠠⠁
					⠀⠀⠢⡈⠑⠚⠿⠷⠶⠿⠟⠋⠀⠀⠀⠀⠀⠀⠈⠛⠿⠾⠿⠿⠕⠛⠁⡰⠁⠀
					⠀⠀⠀⠑⢄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⠊⠀⠀⠀
					⠀⠀⠀⠀⠀⠑⠠⡀⠀⠀⠀⠀⠀⠠⠞⠙⠦⠀⠀⠀⠀⠀⢀⡠⠊⠀⠀⠀⠀⠀
					⠀⠀⠀⠀⠀⠀⠀⠀⠁⠂⠤⢀⣀⣀⣀⣀⣀⣀⣀⡠⠔⠂⠁⠀⠀⠀⠀⠀⠀⠀
				{/if}
			</div>
	</div>
	{:catch error}
		<p>Une erreur s'est produite : {error.message}</p>
	{/await}
{/if}


<style>
	.backdrop {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.8);
		z-index: 1;
	}
	.modal {
		padding: 10px;
		border-radius: 10px;
		max-width: 400px;
		margin: 10% auto;
		text-align: center;
		background: white;
	}
</style>
