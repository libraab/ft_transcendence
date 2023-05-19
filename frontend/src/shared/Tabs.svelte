<script>
	import { createEventDispatcher } from "svelte";
	import RankModal from './Ranking.svelte';
	import FlModal from './FriendList.svelte';
	import { page_shown } from "../stores"

	const dispatch = createEventDispatcher();
	  
  	const show_page = () =>{
  	  const url = event.target.getAttribute("href")
  	  history.pushState({"href_to_show":url}, '', url)
  	  $page_shown = url
  	}

	export let id;

	let ranksTab = false;
	let flTab = false;

	function toggleRanksTab(){
		ranksTab = !ranksTab;
	}

	function toggleFlTab(){
		flTab = !flTab;
	}

</script>

<RankModal {ranksTab} on:click={() => toggleRanksTab()} />
<FlModal {flTab} {id} on:click={() => toggleFlTab()} />

<nav class="tabs">
	<a href="/" on:click|preventDefault={show_page} class:active={$page_shown == "/"}>DashBoard</a>
	<a href="game" on:click|preventDefault={show_page} class:active={$page_shown == "game"}>Game</a>
	<a href="chat" on:click|preventDefault={show_page} class:active={$page_shown == "chat"}>Chat</a>
	<a href="room" on:click|preventDefault={show_page} class:active={$page_shown == "room"}>Room</a>	
</nav>
<center><button class="round-button"
	on:click={() => toggleFlTab()}>Friend List</button>
<button class="round-button" on:click={() => toggleRanksTab()}>Ranking</button>
<button class="round-button">Match history</button></center>


<style>
	.tabs{
		display: flex;
		justify-content: space-around;
		padding: 0 150px;
		margin: 0;
		background-color: #292d39;
		color: lightgray
	}
	a{
		text-decoration: none;
		color: rgb(148, 146, 193);
		text-align: center;
		width: 120px;
		margin: 5px 20px;
		list-style-type: none;
	}
	/*
	li{
		margin: 0 16px;
		font-size: 18px;
		content: #555;
		cursor: pointer;
	}

	li:hover {
		color: #545969;
	} */

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

	.active{
		color: whitesmoke;
		border-bottom: 2px solid whitesmoke;
		padding-bottom: 5px;
	}
</style>
