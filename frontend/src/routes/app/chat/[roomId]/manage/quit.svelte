<script lang="ts">
	import { userId42 } from '$lib/stores';
	import { onMount, afterUpdate } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let data: any;
	export let id: number;
	export let delTab: string;
	export let roomId: number;

	let admins: any = [];
	let members: any = [];
	let roomName: string = '';
	let roomType: string = 'public';
	let password: string = '';

	let isFormVisible: boolean = false;
	const toggleForm = () => {
		isFormVisible = !isFormVisible;
	}

	async function getReplacementLists () {
		try
		{
			const response = await fetch(`/api/rooms/replacementList/${roomId}`);
			if (response.ok)
			{
				const data = await response.json();

				admins = data.admins;
				members = data.members;
			}
			else
			{
				console.error('failed to load replacement list');
			}
		}
		catch (error)
		{
			console.error(error);
		}
	};

	let firstLoad = true;
	onMount(async () => {
		await getReplacementLists();
		firstLoad = false;
	});

	afterUpdate(() => {
		if (!firstLoad) {
			getReplacementLists();
		}
	});

	let stayOption = 'stay'; // Default option is "and stay"

	function handleValidationClick() {
		dispatch('validationClick');
	}

	async function resign(client: any)
	{
		let stay;
		if (stayOption === 'stay')
			stay = true;
		else
			stay = false;
		try
		{
			const response = await fetch
			(`/api/rooms/resign/${roomId}/${id}/${client.id}/${stay}`,{
					method: 'POST',
				});
			if (response.ok)
			{
				handleValidationClick();
			}
			else
			{
				console.error('failed on resign');
			}
		}
		catch (error: any)
		{
			console.error('ERROR: falied on resign', error.message);
		}
	}

	async function eraseRoom()
	{
		try
		{
			const response = await fetch(`/api/rooms/delete/${roomId}`,{
					method: 'POST',
				});
			if (response.ok)
			{
				handleValidationClick();
			}
			else
			{
				console.error(response.status, response.statusText);
			}
		}
		catch (error: any)
		{
			console.error('ERROR: falied on delete', error.message);
		}
	}
	
	const roomTypeDict: { [key: string]: number } =
	{
		"public" : 0,
		"protected" : 1,
		"private" : 2
	}

	const handleSubmit = async (event: any) => {
		if (password === "" && roomType == "protected")
		{
			alert("Please enter a password");
			return ;
		}
		event.preventDefault();
		if (roomType !== 'protected') {
			password = "";
		/*
		* Appel au Post du controller Chat qui va creer la Room dans la Db
		*/
		let type: number = roomTypeDict[roomType];
		const response = await fetch(`/api/rooms/updateRoom/${roomId}`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${data.authToken}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				name: roomName,
				secu: type,
				password,
			})
		});
		if (! response.ok) {
			alert('Failed to update room');
			// handle error
		}
		handleValidationClick();
	}
</script>

	{#await getReplacementLists()}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="backdrop" on:click|self on:keypress={() => getReplacementLists()}>
			<p>Loading...</p>
		</div>

	{:then}
		{#if delTab === 'res'
		&& ((!admins || admins.length === 0)
			&& (!members || members.length === 0))}
		
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div class="backdrop" on:click|self on:keypress>
				<div class="modal">
					<h1>empty room</h1>
					<p>do you want to delete it ?</p>
					<button on:click={()=> eraseRoom()}>yes</button>
					<button on:click>no</button>
				</div>
			</div>
			
		{:else}
			{#if delTab === 'del'}
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="backdrop" on:click|self on:keypress>
					<div class="modal">
						<h1>Are you sure ?</h1>
						<button on:click={()=> eraseRoom()}>yes</button>
						<button on:click>no</button>
					</div>
				</div>

			{:else if delTab === 'update'}
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="backdrop" on:click|self on:keypress>
					<div class="modal">
						<h1>UPDATE</h1>
						<div class="create-container">
						
							<button class="create-btn" on:click={toggleForm}>Update Room</button>
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
									<button type="submit">Update</button>
								</form>
							{/if}
						
						</div>
					</div>
				</div>

			{:else if delTab === 'res'}
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="backdrop" on:click|self on:keypress>
					<div class="modal">
						<h1>To whom do you want to pass ownership ?</h1>
						<br>
						<label>
							<input type="radio" value="leave" name="stayOption" on:change={() => stayOption = 'leave'} checked={stayOption === 'leave'} />
							and leave
						</label>
						<label>
							<input type="radio" value="stay" name="stayOption" on:change={() => stayOption = 'stay'} checked={stayOption === 'stay'} />
							and stay
						</label>

						<h3>admins</h3>

						{#if admins.length > 0}
							{#each admins as admin}
								<button on:click={() => resign(admin)}>{admin.name}</button>
							{/each}
						{:else}
							<p>there's no admins<p>
						{/if}
						<br>
						{#if members.length > 0}
							<h3>members</h3>
							{#each members as member}
								<button on:click={() => resign(member)}>{member.name}</button>
							{/each}
						{:else}
							<p>there's no member</p>
						{/if}
					</div>
				</div>
			{/if}
		{/if}

	{:catch error}
		<p>Une erreur s'est prosuite {error.message}</p>
	{/await}


<style>
	.backdrop {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.8);
		z-index: 1;
	}
	.modal {
		padding: 10px;
		border-radius: 10px;
		max-width: 400px;
		margin: 10% auto;
		text-align: center;
		background: white;
	}
</style>
