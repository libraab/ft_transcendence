<script>

	export let flTab;
	export let id;

	let fl = [];

	async function getFlforId() {
		try {
			const response = await fetch(`http://localhost:3000/dashboard/fl/${id}`)
			if (response)
			{
				fl = await response.json();
			}
			else
				fl = [];
		}
		catch (error) {
			console.error(error);
		}
	}
</script>

{#if flTab}
	{#await getFlforId()}
		<div class="backdrop" on:click|self on:keypress>
			<p>Loading...</p>
		</div>
  	{:then}
		<div class="backdrop" on:click|self on:keypress>
			<div class="modal">
				<h1>Friend List</h1>
				{#if fl.length !== 0}
					{#each fl as friend}
						<pre>{JSON.stringify(friend, null, 0)}</pre>
					{/each}
				{:else}
					<h1>┌∩┐(◕_◕)┌∩┐</h1>
					<p>No friend</p>
					<p>nobody loves you...</p>
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


