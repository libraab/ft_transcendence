<script>
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import UpdateModal from './Update.svelte';
	import DeleteModal from './Delete.svelte';
	import { hostname } from '../../hostname';
	import axios from 'axios';

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

	//HF Titles
	let HF = ["pas du tout", "un peu", "beaucoup", "passionnément", "à la folie"];
	let title = [ "Straitght outta bronze", "Golden pad", "Diamonds Are Forever", "Big Brother", "Daddy"];

	let isDFAActive = false;

	let blocked = false;
	let qrCodeImageUrl = "";
	function toggleBlockState() {
		blocked = !blocked;
	}

	onMount(async () =>
	{
		await getTargetStats();
	});
	
	async function fetchData()
	{
		try
		{
			const response = await fetch(`http://${hostname}:3000/dashboard/${id42}`);
			data = await response.json();
			name = data.name;
			img = data.img;
			returnBackHome();

			return data;
		}
		catch (error)
		{
			console.error(error);
		}
	}

	async function toggleDFAState() {
		isDFAActive = !isDFAActive;
		// Send API request to update DFA status
		try {
			const response = await axios.post(`http://${hostname}:3000/auth/2fa/${id}`, { isDFAActive });
			console.log('DFA status updated in the database.');
			qrCodeImageUrl = response.data.qrCodeImageUrl;
		} catch (error) {
			console.error('Failed to update DFA status:', error);
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
	}

	async function getTargetStats()
	{
		try
		{
			const response = await fetch(`http://${hostname}:3000/dashboard/stats/${id}`)
			if (response)
				stats = await response.json();
			else
				stats = null;
		}
		catch (error) {
			console.error(error);
		}
	}
	
	function moveDisplayToTargetClient(client)
	{
		targetId = client.id;
		targetName = client.name;
		if (client.img === "undefined")
			targetImg = "img/il_794xN.3892173164_egqv.avif";
		else
			targetImg = client.img;
		getTargetStats();
	
		document.getElementById('id42-name-input').value = "";
		searchRes = [];
		id42NameInputNotEmpty = null;
	}

	function returnBackHome()
	{
		targetId = id;
		targetName = name;
		targetImg = img;
		getTargetStats();
	
		document.getElementById('id42-name-input').value = "";
		searchRes = [];
		id42NameInputNotEmpty = null;
	}
	//---------------------------------------------------------------------------//
	const addFriend = async (newFriendId) => {
		const response = await fetch(`http://${hostname}:3000/chat/addFriend`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				newFriendId: newFriendId,
				iddata: data.id
			})
		});
		// if (response.ok) {
		// 	console.log('Joined room:', room.name);
		// } else {
		// 	console.error('Failed to join room:', room.name);
		// }
	};
	//---------------------------------------------------------------------------//
	const blockUser = async (blockedId) => {
		const response = await fetch(`http://${hostname}:3000/chat/blockUser`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				blockedId: blockedId,
				iddata: data.id
			})
		});
		if (response.ok) {
			console.log('User blocked');
		} else {
			console.error('Failed to block user');
		}
	};
	//---------------------------------------------------------------------------//
	const unblockUser = async (unblockedId) => {
		const response = await fetch(`http://${hostname}:3000/chat/unblockUser`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				unblockedId: unblockedId,
				iddata: data.id
			})
		});
		if (response.ok) {
			console.log('User unblocked');
		} else {
			console.error('Failed to unblock user');
		}
	};
	//---------------------------------------------------------------------------//
	const MP = async (newFriend) => {
		// const response = await fetch(`http://${hostname}:3000/chat/addFriend`, {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	body: JSON.stringify({
		// 		newFriendId: newFriend.id,
		// 		iddata: data.id
		// 	})
		// });
		// if (response.ok) {
		// 	console.log('Joined room:', room.name);
		// } else {
		// 	console.error('Failed to join room:', room.name);
		// }
	};
	//---------------------------------------------------------------------------//
	const play = async (newFriend) => {
		// const response = await fetch(`http://${hostname}:3000/chat/addFriend`, {
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
		// 	body: JSON.stringify({
		// 		newFriendId: newFriend.id,
		// 		iddata: data.id
		// 	})
		// });
		// if (response.ok) {
		// 	console.log('Joined room:', room.name);
		// } else {
		// 	console.error('Failed to join room:', room.name);
		// }
	};
	//---------------------------------------------------------------------------//



	async function profileUpdate()
	{
		let client = await fetchData();
		dispatch("updateProfile", client);
	}

	let updatePop = false;
	function toggleUpdatePopup()
	{
		updatePop = !updatePop;
	}

	let deletePop = false;
	function toggleDeletePopup()
	{
		deletePop = !deletePop;
	}
</script>

<UpdateModal {updatePop} {id} on:click={() => toggleUpdatePopup()} on:updated={() => profileUpdate()}/>
<DeleteModal {deletePop} on:click={() => toggleDeletePopup()}/>


<div class="main_body">

	<main class="container">
<!-- ---------------------------------------------------------------------------- -->
		<div class="profile-container">
			{#if targetId === id}
				<h2 class="shiny-text">{name}</h2>
				<div class="profile-info">
					<button class="round-button" on:click={() => toggleUpdatePopup()}>Update</button>
					<button class="round-button" on:click={() => toggleDeletePopup()}>Delete</button>
					<button
						class:active={isDFAActive}
						class:inactive={!isDFAActive}
						class="round-button dfa-button"
						on:click={() => toggleDFAState()}
      				>
       	 			DFA
      				</button>
					{#if qrCodeImageUrl}
					  <img src={qrCodeImageUrl} alt="QR Code" />
					{/if}
				</div>
			{:else}
    			<div class="avatar">
      				<!-- svelte-ignore a11y-missing-attribute -->
      				<img src={targetImg} alt="Avatar">
    			</div>
    			<h2 class="shiny-text">{targetName}</h2>
    			<p>(¬‿¬) (≖ ‿ ≖ ) I am watching you watching</p>
				<div class="button-container">
    				<button class="button-profile" on:click={() => returnBackHome()}>My Profile</button>
    				<button class="button-profile" on:click={() => addFriend(targetId)}>Add Friend</button>
					<button
						class:active={!blocked}
						class:inactive={blocked}
						class="button-profile block-button"
						on:click={() => {
							if (blocked) {
							  unblockUser(targetId);
							} else {
							  blockUser(targetId);
							}
							toggleBlockState();
						  }}
						>
						  {blocked ? 'Unblock' : 'Block'}
      				</button>
    				<button class="button-profile" on:click={() => MP()}>Send Msg</button>
    				<button class="button-profile" on:click={() => play()}>Play</button>
				</div>
  			{/if}
		</div>
<!-- ---------------------------------------------------------------------------- -->
		<div>
			<h2>Stats</h2>
			{#if stats}
				<p> played: { stats.played } </p>
				<p> won: { stats.won } </p>
				{#if stats.hf}
					<p> hf: { stats.hf } </p>
				{/if}
				{#if stats.title}
					<p> hf: { stats.title } </p>
				{/if}
				<p> {stats.won * 100 / stats.played}% victory </p>
				<p> score: { stats.score } </p>
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
	.button-container {
		display: flex;
		gap: 20px;
		margin-right: 20px;
	}

	.button-profile {
		padding: 10px 20px;
		border: none;
		border-radius: 20px;
		font-size: 16px;
		background-color: #4caf50;
		color: white;
		cursor: pointer;
	}

	.button-profile:hover {
		background-color: #45a049;
	}
	
	.button-profile:focus {
		outline: none;
  		box-shadow: 0 0 0 2px #4caf50;
	}

	.profile-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
  	}

	.shiny-text {
		font-size: 36px; /* Increase the font size to make it bigger */
		font-family: "Arial", sans-serif; /* Apply a specific font */
		color: #333; /* Set a desired font color */
		text-shadow: none; /* Remove the text shadow */
	}

	.profile-info {
		display: flex;
		align-items: center;
		justify-content: center;
	}

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

	.avatar {
		width: 130px;
		height: 130px;
		border-radius: 60%;
		overflow: hidden;
		margin-top: 20px;
	}

	.avatar img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.round-button {
		border: none;
		background-color: #9e9c9c;
		border-radius: 20px;
		color: white;
		font-size: 16px;
		font-weight: bold;
		cursor: pointer;
		outline: none;
		padding: 10px 20px;
		margin: 10px;
		transition: background-color 0.3s ease;
	}

	.round-button:hover {
		background-color: #464947;
	}

	.round-button:active {
		transform: scale(0.95);
	}

	.dfa-button.active {
		background-color: green;
	}

	.dfa-button.inactive {
		background-color: red;
	}

	.block-button.inactive {
		background-color: red;
	}	

</style>

  