<script>
	import { createEventDispatcher } from "svelte";
	import RankModal from './Ranking.svelte';
	import FlModal from './FriendList.svelte';

	const dispatch = createEventDispatcher();

	export let tabs;
	export let activeTab;
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

<div class="tabs">
	<ul>
		{ #each tabs as tab }
			<li on:click={ () => dispatch("tabChange", tab) } on:keypress>
				<div class:active={tab === activeTab}>{ tab }</div>
			</li>
		{ /each }
	</ul>

	<button on:click={() => toggleFlTab()}>Friend List</button>
	<button on:click={() => toggleRanksTab()}>Ranking</button>
	<button>Match history</button>

</div>


<style>
	.tabs{
		margin: 0;
		background-color: #292d39;
		color: lightgray
	}
	ul{
		display: flex;
		justify-content: center;
		padding: 10px 100px 5px 100px;
		list-style-type: none;
	}
	li{
		margin: 0 16px;
		font-size: 18px;
		content: #555;
		cursor: pointer;
	}

	li:hover {
		color: #545969;
	}

	.active{
		color: whitesmoke;
		border-bottom: 2px solid whitesmoke;
		padding-bottom: 5px;
	}
</style>
