<script>
	import { onMount } from 'svelte';
	import { hostname } from "../../hostname"
	export let data;
	let rooms = [];
	let isFormVisible = false;
	let roomName = '';
	let roomType = 'public';
	let password = '';

	const toggleForm = () => {
		isFormVisible = !isFormVisible;
	}
	//-----------CREATE----ROOM---------------------------------//
	const handleSubmit = async (event) => {
		event.preventDefault();
		console.log('Creating room:', roomName, 'of type', roomType);
		if (roomType === 'protected') {
				console.log('Password:', password);
		}
		// ici je fais api call  au back
		const response = await fetch(`http://${hostname}:3000/chat`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				roomName,
				roomType,
				password,
				iddata: data.id
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
//-------------------------LIST----ROOM-----------------------------//
	const fetchRooms = async () => {
		const response = await fetch(`http://${hostname}:3000/chat`);
		if (response.ok) {
			rooms = await response.json();
		} else {
			console.error('Failed to fetch rooms');
		}
	};
//----------------------------ONMOUNT----------------------------//
onMount(fetchRooms);
onMount(fetchOwnedRoom);
//-------------------------JOIN--PRIVATE----------------------------//
const handlePasswordInput = async (room, password) => {
		const response = await fetch(`http://${hostname}:3000/chat/verify-password`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				roomId: room.id,
				password: password,
				iddata: data.id
			})
		});
		if (response.ok) {
			console.log('Password is correct');
		} else {
			console.error('Incorrect password or error');
		}
	};

const askForPassword = (room) => {
		const password = prompt('Enter the password:');
		if (password !== null) {
			handlePasswordInput(room, password);
		}
};
//---------------------------JOIN----------NORMAL------------------//
const join = async (room) => {
	const response = await fetch(`http://${hostname}:3000/chat/join`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			roomId: room.id,
			iddata: data.id
		})
	});

	if (response.ok) {
		console.log('Joined room:', room.name);
	} else {
		console.error('Failed to join room:', room.name);
	}
};

//---------------------------OwnedRoom----------LIST------------------//
	let ownedRoom = null;
	async function fetchOwnedRoom()
	{
		try
		{
			const response = await fetch(`http://${hostname}:3000/rooms/${data.id}`);
			if (response.ok)
				ownedRoom = await response.json();
			else
				ownedRoom = null;
		}
		catch (error)
		{
			console.error(error);
		}
	}

	let inspectBoolean = false;
	function inspectToggle()
	{
		inspectBoolean = !inspectBoolean;
	}

	let choosenRoom;
	let choosenRoomId;
	async function switchDisplay(room)
	{
		choosenRoom = room.name;
		choosenRoomId = room.id;
		fetchprivateRoomMembers();
		inspectToggle();
	}

	async function deleteRoom()
	{
		console.log(choosenRoom, choosenRoomId);
		inspectToggle();
	}

	async function resign()
	{
		console.log(choosenRoom, choosenRoomId);
		inspectToggle();
	}

	let privateRoomMembers = null;
	async function fetchprivateRoomMembers()
	{
		try
		{
			const response = await fetch(`http://${hostname}:3000/rooms/privateRoomMember/${choosenRoomId}`);
			if (response.ok)
				privateRoomMembers = await response.json();
			else
				privateRoomMembers = null;
		}
		catch (error)
		{
			console.error(error);
		}
	}

	//let roomMembers = null;
	let roomMembers = [
		{ name: "John", status: 1, id: 1 },
		{ name: "Alice", status: 2, id: 2 },
		{ name: "Bob", status: 2, id: 3 },
		{ name: "Eve", status: 1, id: 4 },
		{ name: "Dave", status: 3, id: 5 }
	];

	async function fetchAllRoomMembers()
	{
		try
		{
			const response = await fetch(`http://${hostname}:3000/rooms/allRoomMember/${choosenRoomId}/${data.id}`);
			if (response.ok)
				roomMembers = await response.json();
			else
				roomMembers = null;
		}
		catch (error)
		{
			console.error(error);
		}
	}

	async function updateClientStatus(roomId, clientId, status) {
		try {
			const response = await fetch(`http://${hostname}:3000/rooms/updateStatus/${roomId}/${clientId}/${status}`, {
				method: 'POST',
			});

			if (response.ok)
			{
				console.log(response);
				console.log('Status updated successfully');
			}
			else
			{
				console.error('Failed to update status');
			}
		}
		catch (error)
		{
			console.error('An error occurred', error);
		}
	}

	async function accept(client) {
		try {
			const response = await fetch(`http://${hostname}:3000/acceptNewMember/${choosenRoomId}/${client.id}`, {
				method: 'POST',
			});

			if (response.ok)
			{
				console.log('New member accepted');
				// Mettez à jour votre état ou effectuez toute autre action nécessaire ici
			}
			else
			{
				const errorText = await response.text();
				throw new Error(errorText);
			}
		}
		catch (error)
		{
			console.error(error);
		}
	}

	async function promote(client)
	{
		updateClientStatufetchAllRoomMemberss(choosenRoomId, client.id, 1);
		fetchAllRoomMember();
	}
	
	async function demote(client)
	{
		updateClientStatus(choosenRoomId, client.id, 2);
		fetchAllRoomMember();
	}
	
	async function ban(client)
	{
		updateClientStatus(choosenRoomId, client.id, 5);
		fetchAllRoomMember();
	}

	async function kick(client)
	{
		try {
			const response = await fetch(`http://${hostname}:3000/rooms/kick/${choosenRoomId}/${client.id}`, {
				method: 'POST',
			});

			if (response.ok)
				console.log('client kicked');
			else
			{
				const errorText = await response.text();
				throw new Error(errorText);
			}
		}
		catch (error)
		{
			throw new Error(error.message);
		}
	}

	async function mute(client)
	{
		updateClientStatus(choosenRoomId, client.id, 3);
		fetchAllRoomMember();
	}

	async function unmute(client)
	{
		updateClientStatus(choosenRoomId, client.id, 2);
		fetchAllRoomMember();
	}

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

	{#if !inspectBoolean}
		{#if ownedRoom}
			<div class="rooms-container">
				<button class="toggle-btn">Your Rooms</button>
				<div class="room-list">
				
					{#each ownedRoom as room}
						<div class="room-item">
							<h3>{room.name}</h3>
							<button class="join-button" on:click={() => switchDisplay(room)}>Inspect</button>
						</div>
					{/each}

				</div>
			</div>
		{/if}

		<div class="rooms-container">
			<button class="toggle-btn">List of Rooms</button>
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

	{:else}
		<div class="create-container">
			<h1>{choosenRoom}</h1>
			<center><button class="toggle-btn" on:click={() => inspectToggle()}>Back</button></center>
		</div>

		{#if privateRoomMembers && privateRoomMembers.length !== 0}
			<div class="rooms-container">
				<button class="toggle-btn">they wanna join</button>
				<div class="room-list">
					{#each Array.from({ length: 6 }, (_, i) => i) as index}
						<div class="room-item">
							<p>dummy{index}</p>
							<div class="buttons">
								<button on:click={() => accept(index)}>Accept</button>
								<button on:click={() => kick(index)}>Deny</button>
								<button on:click={() => ban(index)}>Block</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
		
<!--	{#if roomMembers && roomMembers.length !== 0}-->
			<div class="rooms-container">
				<button class="toggle-btn">Room Members</button>
				<div class="room-list">

					{#each roomMembers as member}
						<div class="room-item">
							<div>
								<p>{member.name}</p>
								<p>[{memberStatusLabels[member.status]}]</p>
							</div>

							<div class="buttons">
								{#if member.status === 5}
									<button on:click={() => kick(member)}>unban</button>
								{:else}
									{#if member.status === 2}
										<button on:click={() => promote(member)}>Promote</button>
									{:else if member.status === 1}
										<button on:click={() => demote(member)}>Demote</button>
									{/if}	

									{#if member.status === 3}
										<button on:click={() => unmute(member)}>unmute</button>
									{:else}
										<button on:click={() => mute(member)}>mute</button>
									{/if}
									<button on:click={() => kick(member)}>kick</button>
									<button on:click={() => ban(member)}>Ban</button>
								{/if}
							</div>
						</div>
					{/each}

				</div>
			</div>

<!--	{:else}
			<div style="display: block; text-align: center;">
				<p style="display: block;">feeling lonely ?</p>
				<img src="https://media.giphy.com/media/1isQ04fzbwXbJKucVI/giphy.gif" style="display: block; margin: 0 auto;" alt="whtever">
			</div>
		{/if}
-->
		<div class="create-container">
			<center><button class="toggle-btn" style="background-color: red;"
				on:click={() => deleteRoom()}>Delete room
			</button></center>
			/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿(╥﹏╥)

			<button class="toggle-btn" style="background-color: red; margin-top: auto;"
				on:click={() => resign()}>Resign
			</button>
			(¬ _¬)ﾉ ciao
		</div>

	{/if}

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