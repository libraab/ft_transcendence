<script>
	import { hostname } from "../../hostname";
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let  id;
	export let	roomId;
	export let	verifTab;

	async function leave()
	{
		try {
			const response = await fetch(`http://${hostname}:3000/rooms/kick/${roomId}/${id}`, {
				method: 'POST',
			});

			if (response.ok)
				console.log('client left');
			else
			{
				const errorText = await response.text();
				throw new Error(errorText);
			}
		}
		catch (error)
		{
			throw new Error(error.message);
		}
		dispatch('leaving');
	}
</script>

{#if verifTab}
	<div class="backdrop" on:click|self on:keypress>
		<div class="modal">
			<h1>Are you sure ?</h1>
			<button on:click={()=> leave()}>yes</button>
			<button on:click>no</button>
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