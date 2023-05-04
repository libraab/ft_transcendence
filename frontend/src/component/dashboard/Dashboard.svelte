<script>
	export let data;

	let id42 = data.id42;
	let id = data.id;
	let name = data.name;
	let img;
	let stats = {};

	let searchRes = [];

	let targetId = -1;
	let targetName;
	let targetImg;
	let targetStats = {};

	async function getSpecifiedClients()
	{
		const retName = document.getElementById('id42-name-input').value;
		if (retName !== '') {
			try {
				const response = await fetch(`http://localhost:3000/dashboard/name/${retName}`);
				searchRes = await response.json();
			}
			catch (error) {
				console.error(error);
			}
		}
		else
			searchRes = [];
	}

	function handleClientClick(client) {
		console.log(client.name);
	}
		//	
</script>

<div class="main_body">
	<main class="container">
		
		<div >
			<h1>id42: {id42}</h1>
			<h1>name: {name}</h1>
			<h1>id: {id}</h1>
		<!--	<label for="id42-input">get by ID42:</label>
			<input type="text" id="id42-input" bind:value={id42} />
			<button on:click={() => fetchData()}>Fetch Data</button>
		-->
			<label for="id42-name-input">search by Name:</label>
			<input type="text" id="id42-name-input" on:input={() => getSpecifiedClients()} />
		</div>

		<div >
			<p>Résultat de l'appel id42 :</p>
			<pre>{JSON.stringify(data, null, 0)}</pre>
			<p>-------------------------------------------------------------------------</p>

			<p>Résultat de search by name :</p>
			<div>
				{#each searchRes as client}
					<button on:click={() => handleClientClick(client)}>{client.name}</button>
				{/each}
			</div>
		</div>

	</main>
</div>

<style>
    .container {
        height: 100%; /* occupe 100% de la hauteur de main_body */
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
</style>

  