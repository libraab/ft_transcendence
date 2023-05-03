<script>
	import Header from "./component/Header.svelte";
	import Footer from "./component/Footer.svelte";
	import Tabs from "./shared/Tabs.svelte";
	import Dashboard from "./component/dashboard/Dashboard.svelte";

	let tabs = ['Dashboard', 'Game', 'Chat', 'Rooms'];
	let activeTab = 'Dashboard';
	
	let id42 = 4444;

	const switchTab = (e) => {
		activeTab = e.detail;
	}

</script>


<Header/>

<main>
	<Tabs {activeTab} {tabs} on:tabChange={ switchTab } />
	{#if activeTab === "Dashboard"}
		<p>This is the dashboard yo</p>
		<Dashboard {id42} />
	{:else if activeTab === "Game"}
		<p>Here to play bro</p>
	{:else if activeTab === "Chat"}
		<p>talk to me</p>
	{:else if activeTab === "Rooms"}
		<p>talk to everyone</p>
	{/if}
</main>

<Footer/>


<style>
	main{
		max-width: 960;
		margin: 40px auto;
	}
</style>