<script>
	import Header from "./component/Header.svelte";
	import Footer from "./component/Footer.svelte";
	import Tabs from "./shared/Tabs.svelte";
	import Dashboard from "./component/dashboard/Dashboard.svelte";
    import { loop_guard } from "svelte/internal";
    import Chat from "./component/chat/Chat.svelte";
    import FriendList from "./shared/FriendList.svelte";

	let tabs = ['Dashboard', 'Game', 'Chat', 'Rooms'];
	let activeTab = 'Dashboard';
	
	let id42 = 4444;
	let data = {};

	let img_path = "img/il_794xN.3892173164_egqv.avif";

	const switchTab = (e) => {
		activeTab = e.detail;
	}
	
	async function fetchData()
	{
		try {
			const response = await fetch(`http://localhost:3000/dashboard/${id42}`);
			data = await response.json();
		}
		catch (error) {
			console.error(error);
		}
		
		return data;
	}

	const handleNewImgPath = (event) => {
		console.log(event.detail);
		console.log("img gonna be upload");
	}
</script>


<Header {img_path} />

{#await fetchData()}
<p>Loading...</p>

{:then dashboardData}
{#if dashboardData}

<Tabs {activeTab} {tabs} id={dashboardData.id} on:tabChange={ switchTab } />
<main>
		<div class="main_body">
			{#if activeTab === "Dashboard"}
				<Dashboard data={dashboardData} on:updateImg={ handleNewImgPath }/>

			{:else if activeTab === "Game"}
					<p>Here to play bro</p>

			{:else if activeTab === "Chat"}
					<Chat/>

			{:else if activeTab === "Rooms"}
					<p>talk to everyone</p>

			{/if}
		</div>
</main>
	{:else}
		<h1>┌∩┐(◕_◕)┌∩┐</h1>
		<p>sry but nop</p>
	{/if}

			{:catch error}
				<h3>Error: {error.message}</h3>

	{/await}

<Footer/>


<style>
	main{
		background: #ececec;
		padding: 20px 0px;;
		width: 100%;
	}
	.main_body {
		/* height: 50vh; 33% de la hauteur de la fenêtre */
		width: 100%; /* 100% de la largeur de la fenêtre */
		/* background: url('path/to/img.png') center/cover no-repeat, blue; */

		/* color: white; */
		margin: 0 auto;
		font-size: 6px;
		font-size: 1vw;
	}
</style>