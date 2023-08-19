<script lang='ts'>
	import { type Rooms, jwt_cookie, userId } from '$lib/stores'
	import { socket } from '$lib/socketsbs';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	// import { reloadRooms, updateCount } from '$lib/socketsbs';
	import { page } from '$app/stores';
	import type { AfterNavigate } from '@sveltejs/kit';

	
	// let rooms_promise;
	let rooms: any = [];

	onMount( async () => {
		/**
		 * Reloading $rooms here is not mandatory but is recomended
		 * otherwise reload is trigered when some rooms changes are done on the backend and signaled trought the socket to the user if connected
		*/
		fetchRooms();
		// if (socket)
		// {
		// 	console.log("comment ça?");
		// 	rooms.forEach((room) => {
		// 		socket.emit('joinChannel', String(room.roomId));
		// 	});
		// }
	});

	//En mettant le fetch seulement en onMount, le block await each saute, Mystere.
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
				console.log(tmp_rooms);
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


	async function getImage(id: number) {
		try
		{
			const response = await fetch(`http://localhost:8080/api/dashboard/avatar/${id}`, {
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
					{#if room.secu !== 3}
					<li class="one-room" class:selected-room={$page.url.pathname === `/app/chat/${room.roomId}`}>
						{#if $page.url.pathname === `/app/chat/${room.roomId}`}
							<p>{room.roomName}</p>
						{:else}
							<a href='/app/chat/{room.roomId}'>{room.roomName}</a>
						{/if}
					</li>
					{:else if room.secu === 3}
						{#if room.ownerid === $userId}
							<li class="one-room one-to-one" class:selected-room={$page.url.pathname === `/app/chat/${room.roomId}`}>
								{#await getImage(room.client2Id)}
									<img src="/logo.jpeg" alt="logo" class="room-img">
									<p>{room.client2.name}</p>
								{:then user} 
									<img src={user.img} alt="logo" class="room-img">
									{#if $page.url.pathname === `/app/chat/${room.roomId}`}
										<p>{room.client2.name}</p>
									{:else}
										<a href='/app/chat/{room.roomId}'>
											{room.client2.name}</a>
									{/if}
								{/await}
							</li>
						{:else}
							<li class="one-room one-to-one" class:selected-room={$page.url.pathname === `/app/chat/${room.roomId}`}>
								{#await getImage(room.ownerid)}
									<img src="/logo.jpeg" alt="logo" class="room-img">
									<p>{room.roomName}</p>
								{:then user} 
									<img src={user.img} alt="logo" class="room-img">
									{#if $page.url.pathname === `/app/chat/${room.roomId}`}
										<p>{room.roomName}</p>
									{:else}
										<a href='/app/chat/{room.roomId}'>
											{room.roomName}</a>
									{/if}
								{/await}
							</li>
						{/if}
						
					{/if}
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

	.one-to-one {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
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

	.one-room p {
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


	.room-img {
		width: 25px;
		height: 25px;
		border-radius: 50%;
		/* margin-right: 20px; */
		object-fit: cover;
		margin-right: 10px;
		/* box-shadow: 0 0 20px rgba(0, 255, 0, 0.5); */
	}
</style>