<script lang="ts">
	import { onMount } from "svelte";
	import { hostname } from "../../../hostname";
	import { img_path } from "../../../stores";

	export let data;
	let stats: any;
	let vals: any;
	let blocked: boolean;

	async function fetchTarget(target: string)
	{
		try
		{
			const response = await fetch(`http://${hostname}:3000/dashboard/getByName/${data.id}/${target}`);
			if (response.ok)
			{
				vals = await response.json();
				if (vals.img === "undefined")
					$img_path = "";
				else
					$img_path = vals.img;
			}
			else
				console.error("layout");

		}
		catch (error)
		{
			console.error("layout" , error);
		}
	}

	onMount(async () => {
		fetchTarget(data.target);
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

	const blockUser = async (blockedId: number) => {
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
	const unblockUser = async (unblockedId: number) => {
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

	function toggleBlockState() {
		blocked = !blocked;
	}

	function clearInput(client: any)
	{
		document.getElementById('id42-name-input').value = "";
		searchRes = [];
		id42NameInputNotEmpty = null;
	}

	const addFriend = async (newFriendId: number) => {
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
	};
	
	function sendInvitation()
	{
		//socket.chat.emit('inviteToPlay', {player_id: data.id, opponent_id: opponent_id});
		//appeler une foncion de creation de la game + redirection vers la game
		//mais je sais pas faire
	}
	
	const MP = async (newFriendId: number) => {
/*		console.log('here');
		const response = await fetch(`http://${hostname}:3000/chat/sendMsg`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				newFriendId: newFriendId,
				iddata: data.id
			})
		});
		if (response.ok) {
			console.log('Joined room:', room.name);
		} else {
			console.error('Failed to join room:', room.name);
		}
*/	};

</script>

<main class="container">
<!-- ---------------------------------------------------------------------------- -->
	<div class="profile-container">
		{#if data.targetMyself}
			<h2 class="shiny-text">Me Myself and I &lt;3</h2>
		{:else if vals}
			{#await vals}
				<p>Loading...</p>
			{:then _}
				{vals.client2[0] && vals.client2[0].status === 1 ? blocked = true: blocked = false}
				<h2 class="shiny-text">{vals.name}</h2>

				<div class="button-container">
					{#if !vals.client2[0] || (vals.client2[0] && vals.client2[0].status !== 0)}
						<button class="button-profile" on:click={() => addFriend(vals.id)}>Add Friend</button>
					{/if}
					<button
						class:active={!blocked}
						class:inactive={blocked}
						class="button-profile block-button"
						on:click={() => {
							if (blocked) {
								unblockUser(vals.id);
							} else {
								blockUser(vals.id);
							}
							toggleBlockState();
							}}
						>
							{blocked ? 'Unblock' : 'Block'}
					</button>
					<button class="button-profile" on:click={() => MP(vals.id)}>Send Msg</button>
					<button class="button-profile" on:click={sendInvitation}>Play</button>
				</div>

			{:catch error}
				<p>Error: {error.message}</p>
			{/await}
		{/if}
	</div>
<!-- ---------------------------------------------------------------------------- -->
	<div class="profile-container">
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
	<div class="profile-container">
		<div>
			<label for="id42-name-input">search by Name:</label>
			<input type="text" id="id42-name-input" on:input={() => getSpecifiedClients()} />
			
			<div class="popup_container">
				{#if id42NameInputNotEmpty}
					<div class="popup">
						{#each searchRes as client}
							<p class="link">
								<a href="/dashboard/{client.name}"
									style="text-decoration: none;"
									on:click={() => fetchTarget(client.name)}
									on:click={() => clearInput(client)}>{client.name}</a>
							</p>
						{/each}
					</div>
				{/if}
			</div>

		</div>
	</div>
<!-- ---------------------------------------------------------------------------- -->
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
		display: inline-block;
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