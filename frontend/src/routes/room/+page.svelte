<script lang="ts">
	import { onMount } from "svelte";
	import { hostname } from "../../hostname";
	import { img_path, userId42, clientName } from "../../stores";
	import { error } from "@sveltejs/kit";

	export let data;
	let rooms: any = [];
	let isFormVisible: boolean = false;
	let roomName: string = '';
	let roomType: string = 'public';
	let password: string = '';

	const toggleForm = () => {
		isFormVisible = !isFormVisible;
	}

	const fetchRooms = async () => {
		const response = await fetch(`http://${hostname}:3000/rooms/valideRooms/${data.id}`);
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
			const response = await fetch(`http://${hostname}:3000/rooms/${data.id}`);
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
							<button class="join-button">
								Inspect
							</button>
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
							<button class="join-button">Protected</button>
						{:else if room.secu == 2}
							<h3>🔒 {room.name}</h3>
							<button class="join-button">Ask to join</button>
						{:else}
							<h3>✅ {room.name}</h3>
							<button class="join-button">Join</button>
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
<!--
		{:else}
			<div class="create-container">
				<h1>{choosenRoom}</h1>
				<center><button class="toggle-btn" on:click={() => inspectToggle()}>Back</button></center>
			</div>

			{#if privateRoomMembers && privateRoomMembers.length !== 0}
				<div class="rooms-container">
					<button class="toggle-btn">they wanna join</button>
					<div class="room-list">
						{#each privateRoomMembers as member}
							<div class="room-item">
								<p>{member.name}</p>
								<div class="buttons">
									<button on:click={() => accept(member)}>Accept</button>
									<button on:click={() => kick(member)}>Deny</button>
									<button on:click={() => ban(member)}>Ban</button>
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
	
			{#if roomMembers && roomMembers.length !== 0}
	   
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

		{:else}
				<div style="display: block; text-align: center;">
					<p style="display: block;">feeling lonely ?</p>
					<img src="https://media.giphy.com/media/1isQ04fzbwXbJKucVI/giphy.gif" style="display: block; margin: 0 auto;" alt="whtever">
				</div>
			{/if}
	
			<div class="create-container">
				<center><button class="toggle-btn" style="background-color: red;"
					on:click={() => toggleDel('del')}>Delete room
				</button></center>
				/̵͇̿̿/’̿’̿ ̿ ̿̿ ̿̿ ̿̿(╥﹏╥)

				<button class="toggle-btn" style="background-color: red; margin-top: auto;"
					on:click={() => toggleDel('res')}>Resign
				</button>
				(¬ _¬)ﾉ ciao
			</div>
-->
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
