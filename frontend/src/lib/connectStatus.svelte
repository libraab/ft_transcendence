<script lang='ts'>
    import { onDestroy, onMount } from "svelte";

	//exported var
	export let userId: number;

	// //var
	// const statusType = {
	// 	Disconnected: 0,
	// 	Connected: 1,
	// 	InGame: 2
	// }

	let userStatus = 0
	let intervalRefresh: NodeJS.Timer;

	function sleep(ms: number){
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	onMount(async () => {
		await sleep(500); // Pause d'une 1/2 seconde

		intervalRefresh = setInterval(() => {
			checkConnexion(userId);
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(intervalRefresh);
	});

	async function checkConnexion(userId: number) {
		try {
			if (!userId) return;

			const response = await fetch(`/api/chat/connected/${userId}`);
			let status = await response.json();
			userStatus = status;
		}
		catch (error)
		{
			console.error(error);
		}
	}



</script>

<div class="connectStats" class:connected={userStatus == 1} class:disconnected={userStatus == 0}>
</div>

<style>
.connectStats
{
	border-radius: 50%;
	width: 10px;
	height: 10px;
}

.connected
{
	background-color: green;
}

.disconnected
{
	background-color: lightgray
}

</style>