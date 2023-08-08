<script lang="ts">
	import { onMount } from "svelte";
	import { img_path, jwt_cookie, clientName, userId } from '$lib/stores';
	// import UpdateModal from './Update.svelte';
	// import DeleteModal from './Delete.svelte';
	// import RankModal from './Ranking.svelte';
	import axios from "axios";
	// import ConnectStatus from "$lib/connectStatus.svelte";

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

	//to fetch
	stats = {win: 3, loose: 3, gp: 20}

	async function getFlforId() {
		try {
			const response = await fetch(`/api/dashboard/fl`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${$jwt_cookie}`
				}
			});
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
		await fetchData();
		await getFlforId();
	});

	let qrCodeImageUrl = "";	

	async function toggleDFAState() {
		isDFAActive = !isDFAActive;
		// Send API request to update DFA status
		console.log("--> " + isDFAActive);
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
</script>

<!-- <UpdateModal {updatePop} id={$userId} on:click={() => toggleUpdatePopup()} on:updated={() => profileUpdate()}/>
<DeleteModal {deletePop} on:click={() => toggleDeletePopup()}/>
<RankModal {ranksTab} on:click={() => toggleRanksTab()} /> -->

	<main class="main_body">
		<div class="profile-container">
			<img src={$img_path} alt="logo" class="rick">
			<h2>{$clientName}</h2>
			<div class="stats">
				<p>victory - {stats.win}</p>
				<p>loses - {stats.loose}</p>
				<p>ratio - 50%</p> <!-- ici faire un calcul division et truc -->
				<p>game points - {stats.gp}</p>
			</div>
			<!-- <div class="profile-info">
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
			</div> -->
		</div>
		<div class="list-container">
			<h3>Match History</h3>
			<ul>
				<li class="mh-list">
					<div class="mh-opponent">
						<img src={$img_path} alt="logo" class="mh-img">
						<p>dmercadi</p>
					</div>
					<p>7</p>
					<p>-</p>
					<p>4</p>
					<div class="mh-opponent">
						<p>bob l'eponge</p>
						<img src={$img_path} alt="logo" class="mh-img">
					</div>
				</li>
				<li class="mh-list">
					<div class="mh-opponent">
						<img src={$img_path} alt="logo" class="mh-img">
						<p>dmercadi</p>
					</div>
					<p>7</p>
					<p>-</p>
					<p>6</p>
					<div class="mh-opponent">
						<p>patrick</p>
						<img src={$img_path} alt="logo" class="mh-img">
					</div>
				</li>
				<li class="mh-list">
					<div class="mh-opponent">
						<img src={$img_path} alt="logo" class="mh-img">
						<p>Grimlins</p>
					</div>
					<p>7</p>
					<p>-</p>
					<p>0</p>
					<div class="mh-opponent">
						<p>dmercadi</p>
						<img src={$img_path} alt="logo" class="mh-img">
					</div>
				</li>
			</ul>
		</div>
		<!-- <div class="profile-container">
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
		</div> -->
	
	<!-- ---------------------------------------------------------------------------- -->
		<!-- <div class="profile-container">
			<h1>My Friends</h1>
			{#if fl.length !== 0}
				{#each fl as friend}
					{#if friend.status == 0}
						<div class="friend-container">
							<a href="/app/dashboard/{friend.client.name}" style="text-decoration: none;"><h2>{friend.client.name}</h2></a>
							<p>&nbsp;&nbsp;&nbsp;</p>
							<div class="emoji-container">
								<center><ConnectStatus userId={friend.id}/></center>
							</div>
						</div>
					{:else}
						<a href="/app/dashboard/{friend.client.name}" style="text-decoration: none;"><h2>{friend.client.name} ⛔️ </h2></a>
					{/if}
				{/each}
			{:else}
				<p>...</p>
			{/if}
		</div> -->
	</main>
	
	<style>
		.main_body {
			width: 100%;
			padding: 20px 0;
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	
		.profile-container {
			padding: 30px 50px;
			background-color: #404040;
			max-width: 300px;
			border-radius: 8px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			text-align: center;
			color: white;
			font-size: 20px;
		  }
	
		h2 {
			font-weight: normal;
			font-size: 20px;
		}
	
		.rick {
			width: 150px;
			height: 150px;
			border-radius: 50%;
			/* margin-right: 20px; */
			object-fit: cover;
			/* box-shadow: 0 0 20px rgba(0, 255, 0, 0.5); */
		}
	
		.list-container {
			padding: 50px 50px;
			border-radius: 8px;
			color: white;
			width: 100%;
		}
	
		.list-container h3 {
			font-weight: normal;
			font-size: 25px;
		}
	
		.list-container ul {
			margin: 0;
			padding: 0;
		}
	
		.mh-list {
			background-color: #404040;
			text-decoration: none;
			list-style: none;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			margin: 10px 50px;
			border-radius: 8px;
		}
	
		.mh-img {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			/* margin-right: 20px; */
			object-fit: cover;
			/* box-shadow: 0 0 20px rgba(0, 255, 0, 0.5); */
		}
	
		.mh-opponent {
			display: flex;
		}
	
		/* .friend-container {
			display: flex;
			align-items: center;
		}
	
		.friend-container h2 {
			margin-right: 10px;
		} */
		/* .emoji-container {
			display: flex;
			flex-direction: column;
		}
	
		.emoji-container span {
			margin-top: 5px;
		} */
		/* 
	
		.profile-info {
			display: flex;
			align-items: center;
			justify-content: center;
			flex-wrap: wrap;
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
		} */
	
		/* Media query for tablets */
		/* @media (min-width: 768px) {
			.container {
				flex-direction: row;
				justify-content: space-around;
			}
	
			.profile-container {
				flex-basis: 33.33%;
				max-width: 33.33%;
			}
		} */
	
		/* Media query for desktops */
		/* @media (min-width: 1024px) {
			.container {
				flex-direction: row;
				justify-content: space-around;
			}
	
			.profile-container {
				flex-basis: 25%;
				max-width: 25%;
			}
		} */
	</style>
	