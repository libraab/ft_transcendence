<script lang="ts">
	import { onMount } from "svelte";
	import { userId, userId42 } from "$lib/stores";

	let rooms: any = [];
	let isFormVisible: boolean = false;
	let roomName: string = '';
	let roomType: string = 'public';
	let password: string = '';

	const toggleForm = () => {
		isFormVisible = !isFormVisible;
	}

	const fetchRooms = async () => {
		const response = await fetch(`/api/rooms/valideRooms/${$userId}`);
		if (response.ok) {
			rooms = await response.json();
		} else {
			console.error('Failed to fetch rooms');
		}
	};

	let ownedRoom: any = [];
	async function fetchOwnedRoom()
	{
		try
		{
			const response = await fetch(`/api/rooms/${$userId}`);
			if (response.ok)
				ownedRoom = await response.json();
			else
				ownedRoom = [];
			console.log(ownedRoom);
		}
		catch (error)
		{
			console.error(error);
		}
	}

	const handleSubmit = async (event: any) => {
		if (password === "" && roomType == "protected")
		{
			alert("Please enter a password");
			return
		}
		event.preventDefault();
		console.log('Creating room:', roomName, 'of type', roomType);
		if (roomType === 'protected') {
				console.log('Password:', password);
		}
		else
			password = "";
		console.log(password);
		// ici je fais api call  au back
		const response = await fetch(`/api/chat`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				roomName,
				roomType,
				password,
				iddata: $userId42
			})
		});
		if (response.ok) {
			console.log('Room created successfully');
			// handle success -> make sure that room is added to the list updates etc
		} else {
			console.error('Failed to create room');
			// handle error
		}
		// Reset les valeurs du formulaure
		roomName = '';
		roomType = 'public';
		password = '';
		toggleForm();
		fetchRooms();
		fetchOwnedRoom();
	}

	const askForPassword = (room: any) => {
		const placeholder = prompt('Enter the password:');
		if (placeholder === null)
			return
		else if (placeholder === "") {
			alert("Please enter a password");
			return;
		}
		else if (placeholder)
			password = placeholder;
		join(room);
	};

	const join = async (room: any) => {
		const response = await fetch(`/api/rooms/join/${room.id}/${$userId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ password })
		});

		if (response.ok)
		{
			console.log('Joined room:', room.name);
		} 
		else if (response.status === 401)
		{
			alert("wrong password");
		}
		else
		{
			console.error('Failed to join room:', room.name);
		}
		fetchRooms();
	};
	
	onMount(fetchRooms);
	onMount(fetchOwnedRoom);

	const memberStatusLabels = {
		1: 'admin',
		2: 'member',
		3: 'muted',
		4: 'kicked',
		5: 'banned',
		6: 'pendant',
	};
</script>
  

<div class="main_body">
	<main class="container">

		{#if ownedRoom && ownedRoom.length > 0}
			<div class="rooms-container">
				<button class="toggle-btn">Your Rooms</button>
				<div class="room-list">
				
					{#each ownedRoom as roomList}
						<div class="room-item">
							{#if roomList.status === 0}
								<p>[owner]</p>
							{:else}
								<p>[admin]</p>
							{/if}
							
							<h3>{roomList.room.name}</h3>
							<a href="/app/room/{roomList.room.name}"><button class="join-button">
								Inspect
							</button></a>
						</div>
					{/each}

				</div>
			</div>
		{/if}

		<div class="rooms-container">
			<button class="toggle-btn">List of available rooms</button>
			<div class="room-list">
				{#each rooms as room}
					<div class="room-item">
						{#if room.secu == 1}
							<h3>❌ {room.name}</h3>
							<button class="join-button" on:click={() => askForPassword(room)}>Protected</button>
						{:else if room.secu == 2}
							<h3>🔒 {room.name}</h3>
							<button class="join-button" on:click={() => join(room)}>Ask to join</button>
						{:else}
							<h3>✅ {room.name}</h3>
							<button class="join-button" on:click={() => join(room)}>Join</button>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<div class="create-container">
			<button class="create-btn" on:click={toggleForm}>Create Room</button>
			{#if isFormVisible}
				<form on:submit={handleSubmit}>
					<label for="room-name">Room Name:</label>
					<input type="text" id="room-name" bind:value={roomName} />
					<br />
					<label for="room-type">Room Type:</label>
					<select id="room-type" bind:value={roomType}>
						<option value="public">Public</option>
						<option value="private">Private</option>
						<option value="protected">Protected</option>
					</select>
					{#if roomType === "protected"}
						<br />
						<label for="password">Password:</label>
						<input type="password" id="password" bind:value={password} />
					{/if}
					<br />
					<button type="submit">Create Room</button>
				</form>
			{/if}
		</div>
	</main>
</div>

<style>
.container {
	height: 100%;
	display: flex;
	justify-content: space-around;
}
.create-container {
	flex: 1;
	padding: 10px;
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
}
.rooms-container {
	flex: 1;
	padding: 10px;
	width: 200px;
	height: 300px;
	display: flex;
	flex-direction: column;
	align-items: center;
}
.room-list {
	flex: 1;
	overflow-y: scroll;
	display: none;
}

.toggle-btn,
.create-btn {
	border: none;
	background-color: #4caf50;
	border-radius: 20px;
	color: white;
	font-size: 16px;
	font-weight: bold;
	cursor: pointer;
	outline: none;
	padding: 10px 20px;
	margin-bottom: 10px;
	transition: background-color 0.3s ease;
}

.toggle-btn:hover,
.create-btn:hover {
	font-size: 20px;
	padding: 15px 30px;
	background-color: #2e8b57;
	text-decoration: underline;
}

.room-list {
	display: block;
}

.room-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

h3 {
	margin-right: 10px;
}

.join-button {
	margin-left: 10px;
	margin-right: 0;
	align-self: flex-end;
}

</style>