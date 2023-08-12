<script lang="ts">
	import { onMount } from "svelte";
	import { img_path, jwt_cookie, clientName, userId } from '$lib/stores';

	// let stats: any = null;
	let match_history: any = [];


	onMount(() => {
		fetchData();
		fetchStats();
	});

	/*
		TODO FOR FL REGULAR CONNECTED SOCKET
	*/
	async function fetchData() {
		try
		{
			const response = await fetch(`/api/dashboard/history/${$userId}`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${$jwt_cookie}`
				}
			});
			if (response.ok)
			{
				let vals = await response.json();
				console.log(vals);
				match_history = vals;
			}
			else
				console.error("history");
		}
		catch (error)
		{
			console.error("history" , error);
		}
	}

	async function fetchStats() {
		try
		{
			const response = await fetch(`/api/dashboard/stats/${$userId}`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${$jwt_cookie}`
				}
			});
			if (response.ok)
			{
				let stats = await response.json();
				console.log(stats);
				// stats = stats;
				return stats
			}
			else
				console.error("history");
		}
		catch (error)
		{
			console.error("history" , error);
		}
	}

	async function getImage(id: number) {
		try
		{
			const response = await fetch(`/api/dashboard/avatar/${id}`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${$jwt_cookie}`
				}
			});
			if (response.ok)
			{
				let client = await response.json();
				return client;
			}
			else
				console.error("avatar");
		}
		catch (error)
		{
			console.error("avatar" , error);
		}
	}

</script>
	<main class="main_body">
		<div class="profile-container">
			<img src={$img_path} alt="logo" class="rick">
			<h2>{$clientName}</h2>
			<div class="stats">
			{#await fetchStats()}
				<p>Loading stats...</p>
			{:then stats} 
				<p>victory - {stats.won}</p>
				<p>loses - {stats.played - stats.won}</p>
				<p>ratio - {stats.won * 100 / stats.played}%</p> <!-- ici faire un calcul division et truc -->
				<p>game points - {stats.won * 5}</p>
			{/await}
			</div>
		</div>
		<div class="list-container">
			<h3>Match History</h3>
			<ul>
				{#each match_history as match}
					<li class="mh-list">
						<div class="mh-opponent">
							{#if match.client1.id === $userId}
								<img src={$img_path} alt="logo" class="mh-img">
							{:else}
								{#await getImage(match.client1.id)}
									<img src="/logo.jpeg" alt="logo" class="mh-img">
								{:then user}
									<img src={user.img} alt="logo" class="mh-img">
								{/await}
							{/if}
							<p>{match.client1.name}</p>
						</div>
						<div class="mh-score">
							<p class:winScore={match.persScore === 4 && match.client1.id === $userId}
								class:looseScore={match.persScore !== 4 && match.client1.id === $userId}>{match.persScore}</p>
							<p>-</p>
							<p class:winScore={match.vsScore === 4 && match.client2.id === $userId}
							class:looseScore={match.vsScore !== 4 && match.client2.id === $userId}>{match.vsScore}</p>
						</div>
						<div class="mh-opponent">
							<p>{match.client2.name}</p>
							{#if match.client2.id === $userId}
								<img src={$img_path} alt="logo" class="mh-img">
							{:else}
								{#await getImage(match.client2.id)}
									<img src="/logo.jpeg" alt="logo" class="mh-img">
								{:then user}
									<img src={user.img} alt="logo" class="mh-img">
								{/await}
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		</div>
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
			max-width: 800px;
		}
	
		.list-container h3 {
			font-weight: normal;
			font-size: 20px;
			text-align: center;
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
			margin: 15px 50px;
			padding: 10px 30px;
			border-radius: 5px;
		}
	
		.mh-img {
			width: 25px;
			height: 25px;
			border-radius: 50%;
			/* margin-right: 20px; */
			object-fit: cover;
			/* box-shadow: 0 0 20px rgba(0, 255, 0, 0.5); */
		}
	
		.mh-opponent {
			display: flex;
			flex-direction: row;
			align-items: center;
		}

		.mh-opponent p {
			margin: 0 20px;
		}
	
		.mh-score {
			display: flex;
			flex-direction: row;
			justify-content: space-around;
			align-items: center;
			width: 30%;
		}

		.winScore {
			color: #30EF00;
		}

		.looseScore {
			color: #EF0000;
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
	