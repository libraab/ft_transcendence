<script>
	import { io } from 'socket.io-client'
    import { onDestroy, onMount } from 'svelte';
	import { hostname } from "../../hostname"
	import { rooms, reloadRooms, newMessage, defineSocketEvents, deleteSocketEvents } from '../../socket';
    import { get } from 'svelte/store';
	import { set_data } from 'svelte/internal';
	import { writable } from 'svelte/store';
	import Invitation from '../../shared/Invitation.svelte';
    import ConnectStatus from '../../shared/connectStatus.svelte';


	// extern variable
	export let data;
	export let socket;
	// let channel;
	
	//usefull var
	let username = data.name;
	
	//State Variables
	let selected_room_id = -1;
	let messages_room_id = [];
	let messages = [];
	let members = [];
	let whoami; // variable qui contient notre status dans la room (owner/admin/user)
	//bind variable
	let user_message = "";

	$: {
		let tmp = messages.filter(data => data.room_id == selected_room_id)
		if (tmp.length)
			messages_room_id = tmp[0].msg_content;
		else if (selected_room_id == -1)
			messages_room_id = []
		else
			fetchMessages(selected_room_id);
	}

	$: { members = fetchMembers(selected_room_id) }

	onMount(() => {
		deleteSocketEvents();
		socket.chat.on('serverToChat', recieveMessage); // on defini le comportement lors de l'event mais cette en sauvegardant le message
		socket.chat.on('serverMessage', recieveServerMessage);
	});
	

	onDestroy(() => {
		socket.chat.off('serverToChat', recieveMessage);
		defineSocketEvents();
	})

	async function fetchMessages(id) {
		try {
			const response = await fetch(`http://${hostname}:3000/chat/messages/${id}`);
			let rjson = await response.json();
			messages.push({ room_id: id, msg_content: rjson});
			messages_room_id = rjson;
		}
		catch (error) {
			console.error(error);
		}
	}

	async function fetchMembers(room_id) {
		try {
			const response = await fetch(`http://${hostname}:3000/chat/room/${room_id}`);
			let rjson = await response.json();
			console.log(rjson);
			let me = rjson.find(el => el.member.id == data.id); // on cherche le member qui est nous meme pour en extraire la secu
			if (me)
				whoami = me.secu;
			else
				whoami = 6; // au cas ou
			return rjson;
		}
		catch (error) {
			console.error(error);
		}
	}

	//Methods
	let changeSelectedId = (id) => {
		if (selected_room_id != id)
			user_message = "";
		selected_room_id = id;
		deleteAlertOn(id);
	};

	let sendMessage = () => {
		socket.chat.emit('chatToServer', {channel: selected_room_id, sender: username, message: user_message, sender_id: data.id42});
		user_message = ""
	}

	let recieveMessage = (msg) => {
		let found = false;
		messages.forEach(e => {
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


	let recieveServerMessage = (msg) => {
		let found = false;
		console.log(msg);
		messages.forEach(e => {
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

	let deleteAlertOn = (roomId) =>
	{
		$rooms = $rooms.map((item) => 
		{
			if (item.roomId === roomId)
				return { ...item, newMsgCount: 0 };
			return (item);
	    });
	}

</script>

<div class="container">
	<div class="list_box">
		{#await reloadRooms()}
			<center><p>Loading...</p></center>
		{:then}
		<ul>
			{#each $rooms as room (room.roomId)}
				<li class:activeroom={room.roomId === selected_room_id} class="one_room" on:click={() => changeSelectedId(room.roomId)} on:keypress>
					{room.roomName}
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
					<!-- si on est admin ou owner  -->
					{#if member.member.id != data.id}
						<button>Profil</button>
						<Invitation socket={socket} data={data} opponent_id={member.member.id} />
					{/if}
				</li>
				{/each}
			{/await}
		</ul>
	</div>
</div>

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