<script>
    import Login from "./component/login/Login.svelte";
    import DfaHomePage from "./component/dfa/dfaHomePage.svelte";
    import Header from "./component/Header.svelte";
    import Footer from "./component/Footer.svelte";
	import Tabs from "./shared/Tabs.svelte";
	import Dashboard from "./component/dashboard/Dashboard.svelte";
	import Chat from "./component/chat/Chat.svelte";
	import Game from "./component/game/pong.svelte"
	import Rooms from "./component/rooms/rooms.svelte";
	import { userId42 } from "./stores";
	import { page_shown } from "./stores"
	import { hostname } from "./hostname"
	import axios from 'axios';
	// import { getSocket, initializeSocket, rooms } from "./socket"

	history.replaceState({"href_to_show":"/"}, "", "/");

	window.addEventListener("popstate", e => {
		console.log(e.state.href_to_show)
		$page_shown = e.state.href_to_show
	})

	let img_path;
	let id;
	let isDFAActive;
	let dashboardValue = null;
	
	// let alertNumber = 0; //nombres de messages reçu non lu
	// initializeSocket(dashboardData);

	async function fetchData() {
		try {
			const cookieValue = document.cookie
				.split('; ')
				.find(cookie => cookie.startsWith('jwt_cookie'))
				.split('=')[1];

			const id42 = document.cookie
				.split('; ')
				.find(cookie => cookie.startsWith('id42'))
				.split('=')[1];
			$userId42 = id42;
			const response = await fetch(`http://${hostname}:3000/dashboard/${id42}`, {
				headers: { 'Authorization': `Bearer ${cookieValue}` }
			});
			if (response.ok)
			{
				const data = await response.json();
				if (data.img !== "undefined")
					img_path = data.img;
				else
    				img_path = "img/il_794xN.3892173164_egqv.avif";

				dashboardValue = data;
				id = data.id;
				isDFAActive = data.Dfa;
				return data;
			} else {
				throw new Error('Failed to fetch dashboard data');
			}
		} catch (error) {
			console.error(error);
		}
	}
	
	const newProfileData = (event) => {
		console.log(event.detail);
		dashboardValue = event.detail;
	}
	
	async function verified() {
		await toggleDFAState();
		dashboardValue = await fetchData();
		isDFAActive = false;
	}

	async function toggleDFAState() {
		isDFAActive = true;
		// Send API request to update DFA status
		try {
			const response = await axios.post(`http://${hostname}:3000/auth/2fa/${id}`, { isDFAActive });
			console.log('DFA status updated in the database to true');
		} catch (error) {
			console.error('Failed to update DFA status: ', error);
		}
	}

</script>



<Header {img_path} />

{#await fetchData()}
	<center><p>Loading...</p></center>

{:then dashboardData}
	{#if dashboardData && isDFAActive}
		<DfaHomePage data={dashboardValue} on:updateVerification={ verified }/>
	{/if}
	{#if dashboardData && !isDFAActive && Object.keys(dashboardData).length > 0}

		<Tabs id={dashboardData.id}/>
		<main>
			<div class="main_body">
				{#if $page_shown == "/"}
					<Dashboard data={dashboardValue} on:updateProfile={ newProfileData }/>
				{:else if $page_shown == "game"}
					<Game/>
				{:else if $page_shown == "chat"}
					<Chat data={dashboardValue}/>
					<!-- <Chat data={dashboardData} socket={getSocket()}/> -->
				{:else if $page_shown === "room"}
					<Rooms data={dashboardValue}/>
				{/if}
			</div>
		</main>

	{:else if !dashboardData }
		<Login/>
	{/if}

{:catch error}
<Header {img_path} />
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