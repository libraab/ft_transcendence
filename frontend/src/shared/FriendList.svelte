<script>
    import { add_flush_callback } from "svelte/internal";
	import { createEventDispatcher } from 'svelte';
	import {hostname} from "../hostname"

	const dispatch = createEventDispatcher();

	export let flTab;
	export let id;

	let fl = [];
	let id42NameInputNotEmpty = false;
	let searchRes = [];

	async function getFlforId() {
		try {
			const response = await fetch(`http://${hostname}:3000/dashboard/fl/${id}`)
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
	
	async function getSpecifiedClients()
	{
		const retName = document.getElementById('id42-name-input').value;
		id42NameInputNotEmpty = retName.trim() !== '';

		if (id42NameInputNotEmpty)
		{
			try
			{
				const response = await fetch(`http://${hostname}:3000/dashboard/name/${retName}`);
				searchRes = await response.json();
			}
			catch (error) {
				console.error(error);
			}
		}
		else
			searchRes = [];
		fl = searchRes;
	}

	async function addFl()
	{
		const response = await fetch(`http://${hostname}:3000/dashboard/fl/${id}`);
		if (response.ok) {
			rooms = await response.json();
		} else {
			console.error('Failed to fetch friend list');
		}
	}

	async function blockTarget()
	{

	}

	async function inspectTarget()
	{
		const target = document.getElementById('id42-name-input').value;
		searchRes = [];
		fl = [];
		id42NameInputNotEmpty = false;
	}

</script>

{#if flTab}
	{#await getFlforId()}
		<div class="backdrop" on:click|self on:keypress={() => getFlforId()}>
			<p>Loading...</p>
		</div>
  	{:then}
<!-- ---------------------------------------------------------------------------- -->
		<div class="backdrop" on:click|self on:keypress>
				<div class="modal">
					<h1>My Friends</h1>
	<!-- ---------------------------------------------------------------------------- -->
					{#if fl.length !== 0}
						{#each fl as friend}
							{#if friend.status == 0}
								<h3> {friend.client.name} </h3>
							{:else}
								<h3> {friend.client.name} ⛔️ </h3>
							{/if}
						{/each}
					{:else}
						<h1>┌∩┐(◕_◕)┌∩┐</h1>
						<p>No friend</p>
						<p>nobody loves you...</p>
					{/if}
	<!-- ---------------------------------------------------------------------------- -->
				</div>
			</div>
	{:catch error}
		<p>Une erreur s'est produite: {error.message}</p>
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


