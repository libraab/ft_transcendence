<script lang='ts'>
	import { userId } from "$lib/stores";

	export let historyTab: boolean;

	let historic: any = [];

	async function getClienthistory() {
		try {
			const response = await fetch(`/api/dashboard/history/${userId}`)
			if (response)
			{
				historic = await response.json();
			}
			else
				historic = [];
		}
		catch (error) {
			console.error(error);
		}
	}
</script>

{#if historyTab}
	{#await getClienthistory()}
		<div class="backdrop" on:click|self on:keypress>
			<p>Loading...</p>
		</div>
  	{:then}
        <div>
            <pre>{JSON.stringify(historic, null, 0)}</pre>
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