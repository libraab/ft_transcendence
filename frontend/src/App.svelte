<script>
	import Header from "./component/Header.svelte";
	import Footer from "./component/Footer.svelte";
	import Tabs from "./shared/Tabs.svelte";
	import Dashboard from "./component/dashboard/Dashboard.svelte";
    import { loop_guard } from "svelte/internal";
    import Chat from "./component/chat/Chat.svelte";

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

<main>
	{#await fetchData()}
		<p>Loading...</p>
	
	{:then dashboardData}
		{#if dashboardData}

			<Tabs {activeTab} {tabs} id={dashboardData.id} on:tabChange={ switchTab } />

			{#if activeTab === "Dashboard"}
				<div class="main_body">
					<p>This is the dashboard yo</p>
					<Dashboard data={dashboardData} on:updateImg={ handleNewImgPath }/>
				</div>

			{:else if activeTab === "Game"}
				<div class="main_body">
					<p>Here to play bro</p>
				</div>

			{:else if activeTab === "Chat"}
				<div class="main_body">
					<p>talk to me</p>
					<Chat/>
				</div>

			{:else if activeTab === "Rooms"}
				<div class="main_body">
					<p>talk to everyone</p>
				</div>

			{/if}

		{:else}
			<h1>┌∩┐(◕_◕)┌∩┐</h1>
			<p>sry but nop</p>

		{/if}

	{:catch error}
		<h3>Error: {error.message}</h3>

	{/await}
</main>

<Footer/>


<style>
	main{
		max-width: 960;
		margin: 40px auto;
	}
	.main_body {
		height: 50vh; /* 33% de la hauteur de la fenêtre */
		width: 80vw; /* 80% de la largeur de la fenêtre */
		background: blue;
		color: white;
		margin: 0 auto;
		font-size: 6px;
		font-size: 1vw;
	}
</style>
