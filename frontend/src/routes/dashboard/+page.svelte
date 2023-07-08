<script lang="ts">
	import { onMount } from "svelte";
	import { hostname } from "../../hostname";
	import { img_path, userId42, clientName} from "../../stores";

	export let data;

	onMount(async () => {
		// $img_path = data.img_path;
		// $userId42 = data.userId42;

		// try
		// {
		// 	const response = await fetch(`http://${hostname}:3000/dashboard/${data.userId42}`);
		// 	if (response.ok)
		// 	{
		// 		let vals = await response.json();
		// 		$clientName = vals.name;
		// 	}
		// 	else
		// 		console.error("layout");

		// }
		// catch (error)
		// {
		// 	console.error("layout" , error);
		// }
	});

	let id42NameInputNotEmpty: any;
	let searchRes: any = [];
	async function getSpecifiedClients()
	{
		const retName = document.getElementById('id42-name-input').value;
		id42NameInputNotEmpty = retName.trim() !== '';

		if (id42NameInputNotEmpty)
		{
			try
			{
				const response = await fetch(`http://${hostname}:3000/dashboard/name/${data.id}/${retName}`);
				searchRes = await response.json();
			}
			catch (error) {
				console.error(error);
			}
		}
		else
			searchRes = [];
	}
</script>

<main class="dashboard">
<!-- ---------------------------------------------------------------------------- -->
	<div class="profile-container">
		<div>
			<label for="id42-name-input">search by Name:</label>
			<input type="text" id="id42-name-input" on:input={() => getSpecifiedClients()} />
			
			<div class="popup_container">
				{#if id42NameInputNotEmpty}
					<div class="popup">
						{#each searchRes as client}
							<p class="link"><a href="/dashboard/{client.name}" style="text-decoration: none;" >{client.name}</a></p>
						{/each}
					</div>
				{/if}
			</div>

		</div>
	</div>
</main>
	
  
<style>
	.dashboard {
		/* height: 50vh; 33% de la hauteur de la fenêtre */
		width: 100%; /* 100% de la largeur de la fenêtre */
		/* background: url('path/to/img.png') center/cover no-repeat, blue; */

		/* color: white; */
		margin: 0 auto;
		font-size: 6px;
		font-size: 1vw;
	}
	.link {
		text-decoration: none;
		transition: background-color 0.3s ease;
	}
	.link:hover {
		background-color: #f0f0f0; /* Couleur de fond grisé */
	}
	.profile-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
  	}
	.popup_container {
		position: relative; /* Ajout du positionnement relatif */
		width: 7vw;
		left: 50%;
		transform: translateX(-50%);
	}
	.popup {
		position: absolute;
		top: calc(100% + 10px); /* Positionnement en dessous de l'input */
		left: 0;
		width: 100%;
		max-height: 200px;
		overflow-y: auto;
		background-color: #fff;
		border: 1px solid #ccc;
		border-radius: 4px;
		padding: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		z-index: 1; /* Assure que la fenêtre contextuelle est au-dessus des autres éléments */
	}
</style>