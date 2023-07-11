<script lang="ts">

	import { onMount } from "svelte";
	import {hostname} from '$lib/hostname';
	import { img_path, userId42, clientName } from '$lib/stores';
	import axios from 'axios';


	export let data;
	let title: string;
	let score: number;
	let won: number;
	let played: number;
	let hf: string;
	let Dfa: boolean;
	let id: number;
	let stats: any = null;
	let fl: any = [];

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

	onMount(async () => {
		Dfa = data.Dfa
		id = data.id;
		img_path.set(data.img);
		console.log("image path is : ", $img_path); // ici c'est le seul endroit ou on change le storage value de img
		clientName.set(data.name);
		// $userId42 = data.userId42;
		// $img_path = data.img;
		// await fetchData();
		// await getFlforId();
	});

	let qrCodeImageUrl = "";	
	async function toggleDFAState() {
		Dfa = !Dfa;

		try {
			const response = await axios.post(`http://${hostname}:3000/auth/2fa/${id}`, { Dfa });
			console.log('DFA status updated in the database.');
			qrCodeImageUrl = response.data.qrCodeImageUrl;
		} catch (error) {
			console.error('Failed to update DFA status:', error);
		}
	}

	/*
		TODO FOR FL REGULAR CONNECTED SOCKET
	*/

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
	// async function profileUpdate()
	// {
	// 	fetchData();
	// }
</script>

<!-- <UpdateModal {updatePop} id={id} on:click={() => toggleUpdatePopup()} on:updated={() => profileUpdate()}/>
<RankModal {ranksTab} on:click={() => toggleRanksTab()} /> -->

<div class="main_body">
	<main class="container">
		<div class="profile-container">
		<h2 class="shiny-text">{$clientName}</h2>
			<div class="profile-info">
				<button class="round-button" on:click={() => toggleUpdatePopup()}>Update</button>
				<button class="round-button" on:click={() => toggleDeletePopup()}>Delete</button>
				<button class="round-button" on:click={() => toggleRanksTab()}>Ranking</button>
				<button
					class:active={Dfa}
					class:inactive={!Dfa}
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
				<a href="/game" style="text-decoration: none;">─=≡Σ((( つ•̀ω•́)つLET’SGOOOO!</a>
			{/if}
		</div>

	<!-- ---------------------------------------------------------------------------- -->
		<div class="profile-container">
			<h1>My Friends</h1>
			{#if fl.length !== 0}
				{#each fl as friend}
					{#if friend.status == 0}
						<div class="friend-container">
							<a href="/dashboard/{friend.client.name}" style="text-decoration: none;"><h2>{friend.client.name}</h2></a>
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
						<a href="/dashboard/{friend.client.name}" style="text-decoration: none;"><h2>{friend.client.name} ⛔️ </h2></a>
					{/if}
				{/each}
			{:else}
				<p>Here you will your Friends.</p>
			{/if}
		</div>
	</main>
</div>

<style>
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
</style>

  