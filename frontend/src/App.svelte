<script>
    import {Route, Router} from "svelte-navigator";
    import Login from "./component/login/Login.svelte";
    import Header from "./component/Header.svelte";
    import Footer from "./component/Footer.svelte";
	import Tabs from "./shared/Tabs.svelte";
	import Dashboard from "./component/dashboard/Dashboard.svelte";
	import Chat from "./component/chat/Chat.svelte";
	import Rooms from "./component/rooms/rooms.svelte";
	import PrivateRoute from "./PrivateRoute.svelte";
	import { userId42 } from "./stores";

    let tabs = ['Dashboard', 'Game', 'Chat', 'Rooms'];
    let activeTab = 'Dashboard';
    let data = {};
    let img_path;

	let dashboardValue = null;

    const switchTab = (e) => { activeTab = e.detail;}

	async function fetchData()
	{
		try
		{
			const cookieValue = document.cookie
											.split('; ')
											.find(cookie => cookie.startsWith('jwt_cookie'))
											.split('=')[1];

			const id42 = document.cookie
									.split('; ')
									.find(cookie => cookie.startsWith('id42'))
									.split('=')[1];
			$userId42 = id42;
			const response = await fetch(`http://localhost:3000/dashboard/${id42}`, {
				headers:
				{
					'Authorization': `Bearer ${cookieValue}`
				}
			});
			if (response.ok)
			{
				const data = await response.json();
				if (data.img !== "undefined")
					img_path = data.img;
				else
    				img_path = "img/il_794xN.3892173164_egqv.avif";

				dashboardValue = data;
				return data;
			}
			else
			{
				throw new Error('Failed to fetch dashboard data');
			}
		}
		catch (error)
		{
			console.error(error);
		}
	}
	
	const newProfileData = (event) => {
		console.log(event.detail);
		console.log("you've been uploaded");
		dashboardValue = event.detail;
	}

</script>


<Header {img_path} />

{#await fetchData()}
	<center><p>Loading...</p></center>

{:then dashboardData}

	{#if dashboardData && Object.keys(dashboardData).length > 0}

		<Tabs {activeTab} {tabs} id={dashboardData.id} on:tabChange={ switchTab } />
		<main>
			<div class="main_body">
				{#if activeTab === "Dashboard"}
					<Dashboard data={dashboardValue} on:updateProfile={ newProfileData }/>

				{:else if activeTab === "Game"}
						<p>Here to play bro</p>

				{:else if activeTab === "Chat"}
						<Chat/>

					{:else if activeTab === "Rooms"}
                            <Rooms/>

				{/if}
			</div>
		</main>

	{:else}
		<center><h1>┌∩┐(◕_◕)┌∩┐</h1></center>
		<center><p>sry but nop</p></center>
		<Login/>
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