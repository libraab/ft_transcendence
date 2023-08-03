<script>
import { jwt_cookie } from "$lib/stores";

async function fetchAvailableRooms() {
	// ici demander throw catch error comme ailleurs
		const response = await fetch(`/api/rooms/valideRooms`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${$jwt_cookie}`
			}
		});
		if (response.status == 200) {
			let rooms = await response.json();
			console.log(rooms);
			return rooms;
		} else {
			console.error('Failed to fetch rooms');
		}
	}
</script>

<div class="rooms-list-content">
	{#await fetchAvailableRooms()}
		<p>Loading available rooms ...</p>
	{:then availableRooms} 
		<ul>
			{#each availableRooms as room}
				<li>nothing</li>
			{/each}
		</ul>
	{/await}
	<div class="btn-create-room-wrapper"><a class="btn-create-room" href="/app/chat/create">Create Room</a></div>
</div>
<div class="void-content"></div>

<style>
	.rooms-list-content {
		width: 100%;
		background-color: #EFEFEF;
		color: black;
	}


	.void-content
	{
		background-color: #404040;
		width: 30vw;
	}

	.btn-create-room-wrapper {
		text-align: center;
		margin: 30px 0;
	}

	.btn-create-room {
		background-color: #3AB45C;
		color: white;
		padding: 15px 20px;
		text-decoration: none;
		cursor: pointer;
		text-align: center;
	}

	/* .btn-create-room a {
		text-decoration: none;
		color: white;
	} */
</style>