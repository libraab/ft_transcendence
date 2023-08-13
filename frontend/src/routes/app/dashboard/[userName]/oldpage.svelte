<script lang="ts">
	import { onMount } from "svelte";
	import { userId } from "$lib/stores.js";

	export let data;
	let stats: any;
	let vals: any;
	let blocked: boolean;
	let target_img: string = "";

	async function fetchTarget(target: string)
	{
		try
		{
			const response = await fetch(`/api/dashboard/getByName/${target}`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${data.authToken}`
				}
			});
			if (response.ok) {
				vals = await response.json();
				if (vals.img === 'undefined')
				{
					console.log('no image');
					target_img = "";
				}
				else
					target_img = vals.img;
			}
			else
				console.error("layout");

		}
		catch (error)
		{
			console.error("layout" , error);
		}
	}

	let befriended: boolean;

	async function loadReload() {
		await fetchTarget(data.target);
		if (data.supp.client2 && data.supp.client2.length > 0 && data.supp.client2[0].status === 1)
			blocked = true;
		else
			blocked = false;
		if (data.supp.client1 && data.supp.client1.length > 0)
			befriended = true;
		else
			befriended = false;
	}

	onMount(async () => {
		await loadReload();
	});

	$: {
		data;
		loadReload();
	}

	const blockUser = async (blockedId: number) => {
		const response = await fetch(`/api/chat/blockUser`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${data.authToken}`
			},
			body: JSON.stringify({
				blockedId: blockedId,
				iddata: $userId
			})
		});
		if (response.ok) {
			console.log('User blocked');
			toggleBlockState();
		} else {
			console.error('Failed to block user');
		}
	};
	//---------------------------------------------------------------------------//
	const unblockUser = async (unblockedId: number) => {
		const response = await fetch(`/api/chat/unblockUser`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${data.authToken}`
			},
			body: JSON.stringify({
				unblockedId: unblockedId,
				iddata: $userId
			})
		});
		if (response.ok) {
			console.log('User unblocked');
			toggleBlockState();
		} else {
			console.error('Failed to unblock user');
		}
		befriended = false;
		blocked = false;
	};

	function toggleBlockState() {
		blocked = !blocked;
	}

	const addFriend = async (newFriendId: number) => {
		const response = await fetch(`/api/chat/addFriend`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${data.authToken}`
			},
			body: JSON.stringify({
				newFriendId: newFriendId,
				iddata: $userId
			})
		});
		if (response.ok)
			befriended = true;
		else
		{
			befriended = false;
			console.error(response.status, response.statusText);
		}
	};

	async function deleteFriendship(id2: number)
	{
		try{

			const response = await fetch(`/api/dashboard/supprFriendship/${id2}`, {
				method: "POST",
				headers: {
					'Authorization': `Bearer ${data.authToken}`
				},
			});
			if (response.ok)
			{
				befriended = false;
				blocked = false;
			}
			else
			{
				console.error("failed to erase friendshipe you re in forever");
			}
		}
		catch(error)
		{
			console.error(error);
		}
	}
	
	function sendInvitation()
	{
		//socket.chat.emit('inviteToPlay', {player_id: $userId, opponent_id: opponent_id});
		//appeler une foncion de creation de la game + redirection vers la game
		//mais je sais pas faire
	}
	
	const MP = async (newFriendId: number) => {
		const response = await fetch(`/api/chat/sendMsg`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				newFriendId: newFriendId,
				iddata: $userId
			})
		});
		if (response.ok) {
			console.log('Joined room:', room.name);
		} else {
			console.error('Failed to join room:', room.name);
		}
	};

</script>

<main class="container">
<!-- ---------------------------------------------------------------------------- -->
	<div class="profile-container">
		{#if data.targetMyself}
			<h2 class="shiny-text">↖ Me Myself and I &lt;3</h2>
		{:else if vals}
			{#await vals}
				<p>Loading...</p>
			{:then _}
				<div class="button-container">
					<img src={target_img} alt="logo" class="rick">
					<h2 class="shiny-text">{vals.name}</h2>
				</div>
				<div class="button-container">
					{#if !befriended && !blocked}
						<button class="button-profile" on:click={() => addFriend(vals.id)}>Add Friend</button>
					{:else if !blocked}
						<button class="button-profile" on:click={() => deleteFriendship(vals.id)}>Remove</button>
					{/if}
					<button
						class:active={!blocked}
						class:inactive={blocked}
						class="button-profile block-button"
						on:click={() => {
							if (blocked) {
								unblockUser(vals.id);
							}
							else {
								blockUser(vals.id);
							}
						}}>
						{blocked ? 'Unblock' : 'Block'}
					</button>
					{#if !blocked}
						<button class="button-profile" on:click={() => MP(vals.id)}>Send Msg</button>
						<button class="button-profile" on:click={sendInvitation}>Play</button>
					{/if}
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
</main>
	
  
<style>
	.rick {
		width: 150px;
		height: 150px;
		border-radius: 50%;
		margin-right: 20px;
		object-fit: cover;
		box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
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

	.container {
		height: 100%; /* occupe 100% de la hauteur de main_body */
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	.block-button.inactive {
		background-color: red;
	}	
</style>