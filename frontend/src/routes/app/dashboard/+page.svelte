<script lang="ts">
	import { onMount } from "svelte";
	import { img_path, jwt_cookie, clientName, userId } from '$lib/stores';
	import UpdateModal from './Update.svelte';
	import DeleteModal from './Delete.svelte';
	import RankModal from './Ranking.svelte';
	import axios from "axios";

	// export let data;
	let title: string;
	let score: number;
	let won: number;
	let played: number;
	let hf: string;
	let id: number;
	let stats: any = null;
	let fl: any = [];
	let isDFAActive: boolean;

	// async function fetchData() {
	// 	try
	// 	{
	// 		const response = await fetch(`http://${hostname}:8080/api/dashboard`);
	// 		if (response.ok)
	// 		{
	// 			let vals = await response.json();
	// 			$clientName = vals.name;

	// 			img_path.set(vals.img);
	// 			stats = vals.clientStats;
	// 			title = vals.clientStats.title;
	// 			score = vals.clientStats.score;
	// 			won = vals.clientStats.won;
	// 			played = vals.clientStats.played;
	// 			hf = vals.clientStats.hf;
	// 			Dfa = vals.Dfa;
	// 			id = vals.id;
	// 		}
	// 		else
	// 			console.error("fetch didnt worked well");
	// 	}
	// 	catch (error)
	// 	{
	// 		console.error("layout" , error);
	// 	}
	// }

	// async function getFlforId() {
	// 	try {
	// 		const response = await fetch(`http://${hostname}:8080/api/dashboard/fl/${id}`)
	// 		if (response)
	// 		{
	// 			fl = await response.json();
	// 		}
	// 		else
	// 			fl = [];
	// 	}
	// 	catch (error) {
	// 		console.error(error);
	// 	}
	// }

	// onMount(async () => {
	// 	Dfa = data.Dfa
	// 	id = data.id;
	// 	img_path.set(data.img);
	// 	clientName.set(data.name);
	// 	// $userId42 = data.userId42;
	// 	// $img_path = data.img;
	// 	// await fetchData();
	// 	// await getFlforId();
	// });

	let qrCodeImageUrl = "";	

	async function toggleDFAState() {
		isDFAActive = !isDFAActive;
		// Send API request to update DFA status
		try {
			const response = await axios.post(`/api/auth/2fa/${$userId}`, { isDFAActive });
			qrCodeImageUrl = response.data.qrCodeImageUrl;
		} catch (error) {
			console.error('Failed to update DFA status:', error);
		}
	}

	/*
		TODO FOR FL REGULAR CONNECTED SOCKET
	*/

	onMount(async () => {
		fetchData();
	})

	async function fetchData() {
		try
		{
			const response = await fetch(`/api/dashboard`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${$jwt_cookie}`
				}
			});
			if (response.ok)
			{
				let vals = await response.json();
				$clientName = vals.name;

				$img_path = vals.img;
				stats = vals.clientStats;
				title = vals.clientStats.title;
				score = vals.clientStats.score;
				won = vals.clientStats.won;
				played = vals.clientStats.played;
				hf = vals.clientStats.hf;
				isDFAActive = vals.Dfa;
				id = vals.id;
			}
			else
				console.error("layout");
		}
		catch (error)
		{
			console.error("layout" , error);
		}
	}

	let updatePop: boolean = false;
	function toggleUpdatePopup()
	{
		updatePop = !updatePop;
	}

	let deletePop: boolean = false;
	function toggleDeletePopup()
	{
		deletePop = !deletePop;
	}
	let ranksTab: boolean = false;
	function toggleRanksTab(){
		ranksTab = !ranksTab;
	}
	async function profileUpdate()
	{
		fetchData();
	}

	// let id42NameInputNotEmpty: any;
	// let searchRes: any = [];
	// async function getSpecifiedClients()
	// {
	// 	const retName = document.getElementById('id42-name-input').value;
	// 	id42NameInputNotEmpty = retName.trim() !== '';

	// 	if (id42NameInputNotEmpty)
	// 	{
	// 		try
	// 		{
	// 			const response = await fetch(`/api/dashboard/name/${retName}`, {
    //                 method: 'GET',
    //                 headers: {
    //                     'Authorization': `Bearer ${$jwt_cookie}`
    //                 }
    //             }); //cookie to do
	// 			searchRes = await response.json();
	// 		}
	// 		catch (error) {
	// 			console.error(error);
	// 		}
	// 	}
	// 	else
	// 		searchRes = [];
	// }
</script>

<UpdateModal {updatePop} id={$userId} on:click={() => toggleUpdatePopup()} on:updated={() => profileUpdate()}/>
<DeleteModal {deletePop} on:click={() => toggleDeletePopup()}/>
<RankModal {ranksTab} on:click={() => toggleRanksTab()} />

<div class="main_body">
	<main class="container">
		<div class="profile-container">
		<h2 class="shiny-text">{$clientName}</h2>
			<div class="profile-info">
				<button class="round-button" on:click={() => toggleUpdatePopup()}>Update</button>
				<button class="round-button" on:click={() => toggleDeletePopup()}>Delete</button>
				<button class="round-button" on:click={() => toggleRanksTab()}>Ranking</button>
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
		</div>

		<div class="profile-container">
			<h2>Stats</h2>
			{#if stats && Object.keys(stats).length > 0}
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
				<a href="/app/game" style="text-decoration: none;">─=≡Σ((( つ•̀ω•́)つLET’SGOOOO!</a>
			{/if}
		</div>

	<!-- ---------------------------------------------------------------------------- -->
		<div class="profile-container">
			<h1>My Friends</h1>
			{#if fl.length !== 0}
				{#each fl as friend}
					{#if friend.status == 0}
						<div class="friend-container">
							<a href="/app/dashboard/{friend.client.name}" style="text-decoration: none;"><h2>{friend.client.name}</h2></a>
							<p>&nbsp;&nbsp;&nbsp;</p>
							<div class="emoji-container">
								<span>connected</span>
								<span>🔴</span>
								<span>🟢</span>
							</div>
							<p>&nbsp;&nbsp;&nbsp;</p>
							<div class="emoji-container">
								<span>in game</span>
								<span>🔴</span>
								<span>🟢</span>
							</div>
						</div>
					{:else}
						<a href="/app/dashboard/{friend.client.name}" style="text-decoration: none;"><h2>{friend.client.name} ⛔️ </h2></a>
					{/if}
				{/each}
			{:else}
				<p>...</p>
			{/if}
		</div>
	<!-- ---------------------------------------------------------------------------- -->
	<!-- <div class="profile-container">
		<div>
			<label for="id42-name-input">search by Name:</label>
			<input type="text" id="id42-name-input" on:input={() => getSpecifiedClients()} />
			
			<div class="popup_container">
				{#if id42NameInputNotEmpty}
					<div class="popup">
						{#each searchRes as client}
							<p class="link">
								<a href="/app/dashboard/{client.name}"
									style="text-decoration: none;"
									>{client.name}</a> -->
									<!-- on:click={() => fetchTarget(client.name)} -->
									<!-- on:click={() => refreshInput(client)}>{client.name}</a> -->
							<!-- </p>
						{/each}
					</div>
				{/if}
			</div>

		</div>
	</div> -->
<!-- ---------------------------------------------------------------------------- -->
	</main>
</div>

<style>
	.main_body {
		width: 100%;
		padding: 20px;
	}

	.friend-container {
		display: flex;
		align-items: center;
	}

	.friend-container h2 {
		margin-right: 10px;
	}
	.emoji-container {
		display: flex;
		flex-direction: column;
	}

	.emoji-container span {
		margin-top: 5px;
	}
	.profile-container {
		/* display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center; */
		margin-bottom: 20px;
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
		flex-wrap: wrap;
	}

	.container {
		height: 100%; /* occupe 100% de la hauteur de main_body */
		display: flex;
		justify-content: space-around;
		flex-direction: column;
		align-items: center;
		text-align: center;
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

	/* Media query for tablets */
	@media (min-width: 768px) {
		.container {
			flex-direction: row;
			justify-content: space-around;
		}

		.profile-container {
			flex-basis: 33.33%;
			max-width: 33.33%;
		}
	}

	/* Media query for desktops */
	@media (min-width: 1024px) {
		.container {
			flex-direction: row;
			justify-content: space-around;
		}

		.profile-container {
			flex-basis: 25%;
			max-width: 25%;
		}
	}
</style>

  
