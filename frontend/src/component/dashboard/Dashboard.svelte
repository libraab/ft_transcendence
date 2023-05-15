<script>
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import UpdateModal from './Update.svelte';
	import DeleteModal from './Delete.svelte';

	const dispatch = createEventDispatcher();

	export let data;

	// display boolean
	let id42NameInputNotEmpty = false;

	// Personnal page
	let id42 = data.id42;
	let id = data.id;
	let name = data.name;
	let img = data.img;

	let searchRes = [];

	// Target to inspect
	let targetId = data.id;
	let targetName = data.name;
	let targetImg = data.img;

	// stats are always target ones
	let stats = {};

	async function fetchData() {
		try {
			const response = await fetch(`http://localhost:3000/dashboard/${id42}`);
			data = await response.json();
		}
		catch (error) {
			console.error(error);
		}
		id = data.id;
		name = data.name;
		img = data.img;
		returnBackHome();
	}

	async function getSpecifiedClients()
	{
		const retName = document.getElementById('id42-name-input').value;
		id42NameInputNotEmpty = retName.trim() !== '';

		if (id42NameInputNotEmpty) {
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

	async function getTargetStats()
	{
		try {
			const response = await fetch(`http://localhost:3000/dashboard/stats/${id}`)
			if (response)
				stats = await response.json();
			else
				stats = null;
		}
		catch (error) {
			console.error(error);
		}
	}
	
	onMount(async () => {
		await getTargetStats();
	});
	
	function moveDisplayToTargetClient(client) {
		targetId = client.id;
		targetName = client.name;
		targetImg = client.img;
		getTargetStats();
	
		document.getElementById('id42-name-input').value = "";
		searchRes = [];
		id42NameInputNotEmpty = null;
	}

	function returnBackHome() {
		targetId = id;
		targetName = name;
		targetImg = img;
		getTargetStats();
	
		document.getElementById('id42-name-input').value = "";
		searchRes = [];
		id42NameInputNotEmpty = null;
	}

	function profileUpdate() {
		fetchData();
		dispatch("updateImg", img);
	}

/*
	function updateButton()
	{
		console.log("Incomming soon");
		dispatch('updateImgPath', 'new/path/to/img.png');
	}
*/

	let updatePop = false;
	function toggleUpdatePopup() {
		updatePop = !updatePop;
	}

	let deletePop = false;
	function toggleDeletePopup() {
		deletePop = !deletePop;
	}
</script>

<UpdateModal {updatePop} {id} on:click={() => toggleUpdatePopup()} on:updated={() => profileUpdate()}/>
<DeleteModal {deletePop} on:click={() => toggleDeletePopup()}/>


<div class="main_body">

	<main class="container">
<!-- ---------------------------------------------------------------------------- -->
		<div >
			{#if targetId === id}
				<h2>{name}</h2>
				<p>Home Sweet Home</p>
				<button on:click={() => toggleUpdatePopup()}>Update</button>
				<button on:click={() => toggleDeletePopup()}>Delete</button>
			{:else}
				<div style="width: 130px; height: 130px; border-radius: 60%; overflow: hidden; margin-top: 20px;">
					<!-- svelte-ignore a11y-missing-attribute -->
					<img src={targetImg} style="width: 100%; height: 100%; object-fit: cover;">
				</div>
				
				<h2>{targetName}</h2>
				<p>(¬‿¬) (≖ ‿ ≖ ) I am watching you watching</p>
				<button on:click={() => returnBackHome()}>My Profile</button>
			{/if}
		</div>
<!-- ---------------------------------------------------------------------------- -->
		<div>
			<h2>Stats</h2>
			{#if stats}
				<pre>{JSON.stringify(stats, null, 0)}</pre>
			{:else}
				<p>didn't play yet</p>
			{/if}
		</div>
<!-- ---------------------------------------------------------------------------- -->
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
				{/if}
			</div>
			
		</div>
<!-- ---------------------------------------------------------------------------- -->
	</main>
		
</div>


<style>
	.container {
		height: 100%; /* occupe 100% de la hauteur de main_body */
		display: flex;
		justify-content: space-around;
		align-items: center;
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
	.popup-button {
		display: block;
		width: 100%;
		margin-bottom: 8px;
	}
</style>

  