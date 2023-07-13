<script lang="ts">
	import { onMount } from "svelte";
	import { userId, userId42, clientName } from "$lib/stores";
	import DelModal from './delete_resign.svelte'
	import { goto } from '$app/navigation';

	export let data;

	let choosenRoom: string;
	let choosenRoomId: number;
	let owned: boolean;
	let members: any;

	let roomMembers: any = [];
	onMount(async () => {
		choosenRoom = data.room;
		members = firstFetchRoomMember();
		choosenRoomId = data.members.roomId.id;
		owned = data.members.status === 0;
		console.log(owned, data.members)

		await fetchprivateRoomMembers();
		await fetchAllRoomMembers();
	});

	async function firstFetchRoomMember()
	{
		try
		{
			const response = await fetch(`/api/rooms/allMemberwithStatus/${$userId42}/${data.room}`);
			if (response.ok)
				return await response.json();
			else {
				return response;
			}
		}
		catch (error) {
			console.error(error);
		}
	}

	let privateRoomMembers: any = [];
	async function fetchprivateRoomMembers()
	{
		try
		{
			const response = await fetch(`/api/rooms/privateRoomMember/${choosenRoomId}`);
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

	async function fetchAllRoomMembers()
	{
		let url;
		console.log(owned);
		if (owned) {
			url = `/api/rooms/allRoomMember/${choosenRoomId}/${$userId}`;
		}
		else {
			url = `/api/rooms/allRoomMemberForAdmins/${choosenRoomId}/${$userId}`;
		}

		try
		{
			const response = await fetch(url);
			if (response.ok)
				roomMembers = await response.json();
			else
				roomMembers = [];
		}
		catch (error)
		{
			console.error(error);
		}
	}

	async function accept(client: any) {
		try {
			const response = await fetch(`/api/rooms/acceptNewMember/${choosenRoomId}/${client.id}`, {
				method: 'POST',
			});

			if (response.ok)
			{
				console.log('New member accepted');
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
		await fetchAllRoomMembers();
		await fetchprivateRoomMembers();
	}

	async function updateClientStatus(roomId: number, clientId: number, status: number) {
		try {
			const response = await fetch(`/api/rooms/updateStatus/${roomId}/${clientId}/${status}`, {
				method: 'POST',
			});

			if (response.ok)
			{
				console.log('Status updated successfully');
			}
			else
			{
				console.error(response.statusText);
				console.error('Failed to update status');
			}
		}
		catch (error)
		{
			console.error('An error occurred', error);
		}
	}


	async function promote(member: any)
	{
		await updateClientStatus(choosenRoomId, member.id, 1);
		await fetchAllRoomMembers();
	}
	
	async function demote(member: any)
	{
		await updateClientStatus(choosenRoomId, member.id, 2);
		await fetchAllRoomMembers();
	}
	
	async function ban(member: any)
	{
		await updateClientStatus(choosenRoomId, member.id, 5);
		await fetchAllRoomMembers();
		await fetchprivateRoomMembers();
	}

	async function kick(client: any)
	{
		try {
			const response = await fetch(`/api/rooms/kick/${choosenRoomId}/${client.id}`, {
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
		catch (error: any)
		{
			throw new Error(error.message);
		}
		await fetchAllRoomMembers();
		await fetchprivateRoomMembers();
	}

	async function mute(client: any)
	{
		await updateClientStatus(choosenRoomId, client.id, 3);
		await fetchAllRoomMembers();
	}

	async function unmute(client: any)
	{
		await updateClientStatus(choosenRoomId, client.id, 2);
		await fetchAllRoomMembers();
	}

	let delTab: string = "";
	function toggleDel(source: string)
	{
		delTab = source;
	}

	function delReturn() {
		delTab = "";
		goto("/app/room");
	}

	const memberStatusLabels: any = {
		1: 'admin',
		2: 'member',
		3: 'muted',
		4: 'kicked',
		5: 'banned',
		6: 'pendant',
	};
</script>

{#if delTab !== ""}
	<DelModal {delTab} roomId={choosenRoomId} id={$userId}
		on:click={()=> toggleDel("")}
		on:validationClick={ delReturn }/>
{/if}
  
<div class="main_body">
	<main class="container">
		<div class="create-container">
			<h1>{choosenRoom}</h1>
			<a href="/app/room"><center><button class="toggle-btn">Back</button></center></a>

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
		
		<div class="rooms-container">
			<button class="toggle-btn">Room Members</button>
			<div class="room-list">

				{#each roomMembers as member}
					{#if member.status !== 6}
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
					{/if}
				{/each}

			</div>
		</div>

		{#if owned}
			<div class="create-container">
				╭∩╮( •̀_•́ )╭∩╮
				<center><button class="toggle-btn" style="background-color: red;"
					on:click={() => toggleDel('del')}>Delete room
				</button></center>
				<button class="toggle-btn" style="background-color: red; margin-top: auto;"
					on:click={() => toggleDel('res')}>Resign
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