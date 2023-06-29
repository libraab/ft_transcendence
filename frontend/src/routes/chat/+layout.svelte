<script lang="ts">
	import { onMount } from "svelte";
	import { hostname } from "../../hostname";
	import { img_path, userId42, clientName } from "../../stores";
	import { getSocket } from "../../socket";
	import { rooms, reloadRooms, newMessage, defineSocketEvents, deleteSocketEvents } from "../../socket";

	export let data;
	
	let socket = getSocket();
	let username = data.name;

	let selected_room_id: number;
	let messages_room_id: any = [];
	let messages: any = [];

	let user_message = "";

	onMount(async () => {
		img_path.set(data.img_path);
		userId42.set(data.userId42);

		try
		{
			const response = await fetch(`http://${hostname}:3000/dashboard/${data.userId42}`);
			if (response.ok)
			{
				let vals = await response.json();
				$clientName = vals.name;
			}
			else
				console.error("layout");

		}
		catch (error)
		{
			console.error("layout" , error);
		}
	});

	let changeSelectedId = (id: number) => {
		if (selected_room_id != id)
			user_message = "";
		selected_room_id = id;
		deleteAlertOn(id);
	};

	let sendMessage = () => {
		socket.chat.emit('chatToServer', {channel: selected_room_id, sender: username, message: user_message, sender_id: data.userId42});
		user_message = ""
	}

	let receiveMessage = (msg: any) => {
		let found = false;
		messages.forEach((e:any) => {
			if (e.room_id == msg.channel)
			{
				found = true;
				e.msg_content.push({sender: msg.sender, message: msg.message});
			}
		});
		messages = messages;
		if (msg.channel != selected_room_id)
			newMessage(msg);
	}


	let receiveServerMessage = (msg: any) => {
		let found = false;
		console.log(msg);
		messages.forEach((e: any) => {
			if (e.room_id == msg.channel)
			{
				found = true;
				e.msg_content.push({sender: "server", message: msg.message});
			}
		});
		messages = messages;
		if (msg.channel != selected_room_id)
			newMessage(msg);
	}

	let deleteAlertOn = (roomId: number) =>
	{
		$rooms = $rooms.map((item: any) => 
		{
			if (item.roomId === roomId)
				return { ...item, newMsgCount: 0 };
			return (item);
	    });
	}

	let verifTab = false;
	function verification()
	{
		verifTab = !verifTab;
	}

	let roomId;
	async function leaveRoom(room: any)
	{
		roomId = room.roomId;
//		await reloadRooms();
		verification();
	}
</script>
  
<div class="container">
	<div class="list_box">
		{#await reloadRooms()}
			<center><p>Loading...</p></center>
		{:then}
		<ul>
			{#each $rooms as room (room.roomId)}
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<li class:activeroom={room.roomId === selected_room_id} class="one_room" on:click={() => changeSelectedId(room.roomId)} on:keypress>
					{room.roomName}
					{#if room.secu !== 3}
						<button style="float: right;" on:click={() => leaveRoom(room)}>leave</button>
					{/if}
					<div class="alertBox" class:alertOn={room.newMsgCount !== 0}>{room.newMsgCount}</div>
				</li>
			{:else}
			<p>you don't have friends</p>
			{/each}
		</ul>
		{/await}
	</div>
	<div class="room_wrap">
		<ul class="messages">
			{#each messages_room_id as message}
					<li class="one_message" class:servermsg={message.sender === 'server'}>
						<strong>{message.sender}</strong>: {message.message}
					</li>
			{:else}
				{#if selected_room_id != -1}
					<p class="info">no messages, be the first one</p>
				{:else}
					<p class="info">no room selected</p>
				{/if}
			{/each}
		</ul>
		<form on:submit|preventDefault={sendMessage} class="component_send_box">
			<input type="text" placeholder="write a message, or shut up" bind:value={user_message}>
			<button>send</button>
		</form>
	</div>
<!--
	<div class="members">
		<ul>
			{#await members}
			<center><p>Loading...</p></center>
			{:then members}
				{#each members as member}
				<li class="one_member">
					<strong>{member.member.name}</strong><ConnectStatus userId={member.member.id} />
					{#if member.status == 0}
					♚
					{:else if member.status == 1}
					♟
					{/if}
					<!-- si on est admin ou owner  
					{#if member.member.id != data.id}
						<button>Profil</button>
						<Invitation socket={socket} data={data} opponent_id={member.member.id} />
					{/if}
				</li>
				{/each}
			{/await}
		</ul>
	</div>
-->
</div>

<slot></slot>
  
<style>
	.container {
		background-color: white;
		border-radius: 10px;
		border: solid;
		border-color: #eaeaea;
		border-width: 1px 0px 0px 1px;

		color: black;
		/* height: 100%; occupe 100% de la hauteur de main_body */
		margin: 0px 200px;
		max-width: 80wv;
		min-height: 50vh;

		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		overflow: hidden;
	}

	.list_box {
		color: whitesmoke;
		background-color: #292d39;
		width: 200px;
		max-height: 60vh;
		overflow: scroll;
	}

	.alertBox {
		position: absolute;
		top: 15px;
		right: 15px;
		width: 20px;
		height: 20px;
		background-color: red;
		color: white;
		border-radius: 50%;
		text-align: center;
		line-height: 20px;
		font-size: 12px;
		display: none;
	}

	.alertOn
	{
		display: block;
	}

	.one_room {
		position: relative;
		font-size: 18px;
		padding: 15px;
		cursor: pointer;
		border-bottom: 1px #898f9f solid;
	}
	/* .alertBox
	{
		width: 10px;
		height: 10px;
		background-color: brown;
		border-radius: 5px;
		display: none;
	} */

	.alertOn
	{
		display: block;
	}

	.one_room:hover {
		background-color: #505668;
	}

	.activeroom {
		background-color: #898f9f;
	}

	li {
		list-style: none;
	}

	.room_wrap {
		width: 100%;
		/* max-height: 60vh; */
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		background: #ffffff;
		color: #292d39;
		padding: 5px;
		max-height: 60vh;
	}

	.component_send_box {
		border: solid 1px lightseagreen;
		border-radius: 50px;
		overflow: hidden;
		margin: 0px 20px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: baseline;
	}

	.component_send_box input {
		border: none;
		width: 100%;
		max-width: 80%;
	}

	input:focus {
    	outline: none;
	}

	.component_send_box button {
		border: none;
		border-radius: 0px;
		width: 100px;
		height: 100%;
		background: lightseagreen;
	}

	.messages {
		max-height: 50vh;
		overflow: scroll;
	}

	.one_message {
		padding: 2px;
	}

	.servermsg {
		color: gray;
	}
	.servermsg strong {
		color: rgb(190, 43, 29);
	}

	.info {
		width: 100%;
		color: gray;
		text-align: center;
	}
</style>