<script>
    import { add_flush_callback } from "svelte/internal";
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let flTab;
	export let id;

	let fl = [];
	let id42NameInputNotEmpty = false;
	let searchRes = [];

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
	
	async function getSpecifiedClients()
	{
		const retName = document.getElementById('id42-name-input').value;
		id42NameInputNotEmpty = retName.trim() !== '';

		if (id42NameInputNotEmpty)
		{
			try
			{
				const response = await fetch(`http://localhost:3000/dashboard/name/${retName}`);
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
		<div class="backdrop" on:click|self on:keypress>
			<p>Loading...</p>
		</div>
  	{:then}
<!-- ---------------------------------------------------------------------------- -->
		<div class="backdrop" on:click|self on:keypress>
				<div class="modal">
					<h1>Friend List</h1>

					<div>
						<label for="id42-name-input">search by Name:</label>
						<input type="text" id="id42-name-input" on:input={() => getSpecifiedClients()} />
					</div>
	<!-- ---------------------------------------------------------------------------- -->
					{#if fl.length !== 0}
						{#each fl as friend}
							<h3> {friend.name} </h3>
							<button on:click={ ()=> addFl() }>add</button>
							<button on:click={ ()=> blockTarget() }>block</button>
							<button on:click={ ()=> inspectTarget() }>inspect</button>
							<p>-----------------</p>
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


