<script lang='ts'>
	import { type Rooms, jwt_cookie } from '$lib/stores'
	import { socket } from '$lib/socketsbs';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	// import { reloadRooms, updateCount } from '$lib/socketsbs';
	import { page } from '$app/stores';
	import type { AfterNavigate } from '@sveltejs/kit';

	
	// let rooms_promise;
	let rooms: Rooms[] = [];

	onMount( async () => {
		/**
		 * Reloading $rooms here is not mandatory but is recomended
		 * otherwise reload is trigered when some rooms changes are done on the backend and signaled trought the socket to the user if connected
		*/
		// console.log("onmount chat layout");
		//reloadRooms();
		// console.log($page.route);
		fetchRooms();
		if (socket)
		{
			rooms.forEach((room) => {
				socket.emit('joinChannel', String(room.roomId));
			});
		}
	});

	//pour l'instant cette partie est inutile car le layout est reload a chaque navigation, mais en mettant le fetch seulement en onMount, le block await each saute, Mystere.
	// solution? mettre le fetch dans le load?
	afterNavigate( (navigation: AfterNavigate) => {
		// if (navigation && navigation.from('/app/chat/create'))
			fetchRooms();
	})

	async function fetchRooms() {
		try {
			const response = await fetch(`/api/chat`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${$jwt_cookie}`
				}
			});
			if (response.status == 200)
			{
				let tmp_rooms = await response.json();
				// tmp_rooms = tmp_rooms.map((el) => {
				// 	let item = curr_rooms.find((room) => (room.roomId == el.roomId));
				// 	if (item == undefined)
				// 		return { ...el, newMsgCount: 0 };
				// 	return (item);
				// });
				rooms = tmp_rooms;
			}
			else
				console.error(response.status, response.statusText);
			return null;
		}
		catch (error) {
			console.error(error);
		}
	}


</script>

<div class="container">
	<div class="list_box">
		<ul>
			<li class="one-room btn-manage-room">
				{#if $page.url.pathname === '/app/chat/rooms'}
					<a href="/app/chat">&lt;</a>
				{:else if $page.url.pathname === '/app/chat/create'}
					<a href="/app/chat/rooms">&lt;</a>
				{:else}
					<a href="/app/chat/rooms">+</a>
				{/if}
			</li>
			<!-- {#await rooms_promise then rooms} -->
				{#each rooms as room (room.roomId)}
					<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
					<li class="one-room" class:selected-room={$page.url.pathname === `/app/chat/${room.roomId}`}>
						<a href='/app/chat/{room.roomId}'>{room.roomName}</a>
					</li>
				{:else}
				<li class="one-room"><p>You don't have rooms</p></li>
				{/each}
			<!-- {/await} -->
		</ul>
	</div>
	<slot></slot>
</div>

<style>
	.container {
		/* padding-top: 20px; */
		height: 70vh;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		overflow: hidden;
	}

	.list_box {
		color: whitesmoke;
		background-color: #404040;
		width: 30vw;
		overflow: scroll;
	}

	.one-room {
		/* padding: 15px 20px; */
		text-align: center;
	}

	.selected-room {
		background-color: #3AB45C;
	}

	.one-room a {
		display: block;
		padding: 15px 0;
		text-decoration: none;
		color: white;
	}

	.btn-manage-room {
		color: white;
		background-color: #3AB45C;
	}

	.alertBox
	{
		width: 10px;
		height: 10px;
		background-color: brown;
		border-radius: 5px;
		display: none;
	}

	.alertOn
	{
		display: block;
	}



	/* .activeroom {
		background-color: #898f9f;
	} */

	ul {
		padding: 0;
		margin: 0;
	}

	li {
		list-style: none;
	}

</style>