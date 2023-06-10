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
		inspectToggle();
	}

	async function accept(id)
	{
		console.log('hey welcome');
	}

	async function deny()
	{
		console.log('get the f out');
	}

	async function promote()
	{
		console.log('you ve been promoted congrats');
	}
	
	async function demote()
	{
		console.log('oooouh... you messed up...');
	}
	
	async function ban()
	{
		console.log('t as des baskets tu sors');
	}
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
							<h3>🔒 {room.name}</h3>
							<button class="join-button" on:click={() => askForPassword(room)}>Join</button>
						{:else}
							<h3>{room.name}</h3>
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

		<div class="rooms-container">
			<button class="toggle-btn">they wanna join</button>
			<div class="room-list">
				{#each Array.from({ length: 6 }, (_, i) => i) as index}
					<div class="room-item">
						<p>dummy{index}</p>
						<div class="buttons">
							<button on:click={() => accept(index)}>Accept</button>
							<button on:click={() => deny(index)}>Deny</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
		
		<div class="rooms-container">
			<button class="toggle-btn">Room Members</button>
			<div class="room-list">
				{#each Array.from({ length: 6 }, (_, i) => i) as index}
					<div class="room-item">
						<p>dummy{index}</p>
						<div class="buttons">
							<button on:click={() => promote(index)}>Promote</button>
							<button on:click={() => demote(index)}>Demote</button>
							<button on:click={() => ban(index)}>Ban</button>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="create-container">
			<center><button class="toggle-btn" style="background-color: red;" on:click={() => inspectToggle()}>Delete Room</button></center>
			/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿(╥﹏╥)
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