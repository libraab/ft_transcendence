<script>

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

	function moveDisplayToTargetClient(client)
	{
		console.log("hahaha");
		document.getElementById('id42-name-input').value = "";
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
					
					<div class="popup_container">
						{#if id42NameInputNotEmpty}
							<div class="popup">
								{#each searchRes as client}
									<button class="popup-button" on:click={() => moveDisplayToTargetClient(client)}>{client.name}</button>
								{/each}
							</div>
						{:else}
							getFlforId();
						{/if}
					</div>
				</div>
<!-- ---------------------------------------------------------------------------- -->
				{#if fl.length !== 0}
					{#each fl as friend}
						<h3> {fl.name} </h3>
						<button>add</button>
						<button>block</button>
						<button>inspect</button>
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


