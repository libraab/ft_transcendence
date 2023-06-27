<script lang="ts">
	import RankModal from './Ranking.svelte';
	import { onMount } from "svelte";
	import { hostname } from "../hostname";
	import { img_path, userId42, clientName } from "../stores";
	import axios from 'axios';
	import UpdateModal from './Update.svelte';

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

	async function fetchData() {

		try
		{
			const response = await fetch(`http://${hostname}:3000/dashboard/${data.userId42}`);
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
				Dfa = vals.Dfa;
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

	async function getFlforId() {
		try {
			const response = await fetch(`http://${hostname}:3000/dashboard/fl/${id}`)
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

	onMount(async () => {		
		$userId42 = data.userId42;
		$img_path = data.img;
		await fetchData();
		await getFlforId();
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
	async function profileUpdate()
	{
		fetchData();
	}
</script>

<UpdateModal {updatePop} id={id} on:click={() => toggleUpdatePopup()} on:updated={() => profileUpdate()}/>
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
							<a href="/dashboard" style="text-decoration: none;"><h2>{friend.client.name}</h2></a>
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
						<h3> {friend.client.name} ⛔️ </h3>
					{/if}
				{/each}
<!--		{:else}
				<h1>┌∩┐(◕_◕)┌∩┐</h1>
				<p>No friend</p>
				<p>nobody loves you...</p> -->
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

  