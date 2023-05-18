<script>
	import { io } from 'socket.io-client'
    import { onMount } from 'svelte';
	import { hostname } from "../../hostname"

	// extern variable
	export let data;
	let username = data.name;
	//Variables
	let selected_room_id = -1;
	let messages_room_id = [];
	let user_message = "";
	let rooms = [];
	let messages = [];
	let socket = { chat: null, alerts: null};
	let newMsgAlert = [];

	
	onMount(() => {
		socket.chat = io(hostname+':3000/chat', {path: '/chatsockets'}); // dans App directement -- on crée la socket
		socket.chat.on('serverToChat', (msg) => { recieveMessage(msg)}); // on defini le comportement lors de l'event
		fetchData();
		console.log('the component has mounted');
	});
	
	async function fetchData() {
		try {
			const response = await fetch(`http://${hostname}:3000/chat/${data.id42}`);
			rooms = await response.json();
			connectToAllChannel();
		}
		catch (error) {
			console.error(error);
		}
	}

	//Data
	// let rooms = [ //is fetched on mount
	// 	{ name: 'Transcandence', id: 1},
	// 	{ name: 'some Guy', id: 2},
	// 	{ name: 'some Groupe', id: 15},
	// 	{ name: 'best friend', id: 23},
	// 	{ name: 'Transcandence', id: 30},
	// 	{ name: 'some Guy', id: 31},
	// 	{ name: 'some Groupe', id: 32},
	// 	{ name: 'best friend', id: 33},
	// 	{ name: 'Transcandence', id: 34},
	// 	{ name: 'some Guy', id: 35},
	// 	{ name: 'some Groupe', id: 36},
	// 	{ name: 'best friend', id: 37}
	// ]
	
	//let messages = [] starting messages data like this, then fetch function on click event chen connecting to the channel
	// let messages = [
	// 	// {room_id: 1, msg_content:[ { sender: "silas", message: "Hi it's me silas"} , { sender: "dmercadi", message: "Hi! Do you want to talk about our savior Rick?"}, { sender: "silas", message: "Schrcool!"}] },
	// 	// {room_id: 15, msg_content:[ { sender: "asma", message: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", message: "What PiccleRick woudl do?"}, { sender: "Haythem", message: "He is one of them!!" }, { sender: "server", message: "Lionel has been kicked"} ]},
	// 	// {room_id: 37, msg_content:[ { sender: "asma", message: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", message: "What PiccleRick woudl do?"}, { sender: "Haythem", message: "He is one of them!!" }, { sender: "server", message: "Lionel has been kicked"},{ sender: "asma", message: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", message: "What PiccleRick woudl do?"}, { sender: "Haythem", message: "He is one of them!!" }, { sender: "server", message: "Lionel has been kicked"},{ sender: "asma", message: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", message: "What PiccleRick woudl do?"}, { sender: "Haythem", message: "He is one of them!!" }, { sender: "server", message: "Lionel has been kicked"},{ sender: "asma", message: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", message: "What PiccleRick woudl do?"}, { sender: "Haythem", message: "He is one of them!!" }, { sender: "server", message: "Lionel has been kicked"},{ sender: "asma", message: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", message: "What PiccleRick woudl do?"}, { sender: "Haythem", message: "He is one of them!!" }, { sender: "server", message: "Lionel has been kicked"},{ sender: "asma", message: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", message: "What PiccleRick woudl do?"}, { sender: "Haythem", message: "He is one of them!!" }, { sender: "server", message: "Lionel has been kicked"},{ sender: "asma", message: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", message: "What PiccleRick woudl do?"}, { sender: "Haythem", message: "He is one of them!!" }, { sender: "server", message: "Lionel has been kicked"},{ sender: "asma", message: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", message: "What PiccleRick woudl do?"}, { sender: "Haythem", message: "He is one of them!!" }, { sender: "server", message: "Lionel has been kicked"},{ sender: "asma", message: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", message: "What PiccleRick woudl do?"}, { sender: "Haythem", message: "He is one of them!!" }, { sender: "server", message: "Lionel has been kicked"},{ sender: "asma", message: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", message: "What PiccleRick woudl do?"}, { sender: "Haythem", message: "He is one of them!!" }, { sender: "server", message: "Lionel has been kicked"},{ sender: "asma", message: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", message: "What PiccleRick woudl do?"}, { sender: "Haythem", message: "He is one of them!!" }, { sender: "server", message: "Lionel has been kicked"} ]},
	// ]

	let connectToAllChannel = () => {
		rooms.forEach(room => {
			socket.chat.emit('joinChannel', room.roomId);
		});
	}

	async function fetchMessages(id) {
		try {
			const response = await fetch(`http://${hostname}:3000/chat/messages/${id}`);
			let rjson = await response.json();
			messages.push({ room_id: id, msg_content: rjson});
			messages_room_id = rjson;
			// console.log(messages);
		}
		catch (error) {
			console.error(error);
		}
	}

	//Methods
	let change_showing_messages = (id) => {
		if (selected_room_id != id)
			user_message = "";
		selected_room_id = id;
		let room = messages.filter(data => data.room_id == id);
		if (room.length)
			messages_room_id = messages.filter(data => data.room_id == id)[0].msg_content;
		else
		{
			fetchMessages(selected_room_id);
			//here correcting last message based on Date()
			//change_showing_messages(id);
		}
		if (isAlertOn(id, newMsgAlert))
			deleteAlertOn(id);
	};

	let sendMessage = () => {
		console.log("send_message");
		socket.chat.emit('chatToServer', {channel: selected_room_id, sender: username, message: user_message, sender_id: data.id42});
		user_message = ""
	}

	async function recieveMessage(msg) {
		let found = false;
		messages.forEach(e => {
			if (e.room_id == msg.channel)
			{
				found = true;
				e.msg_content.push({sender: msg.sender, message: msg.message});
			}
		});
		if (found == false)
		{
			//here fetching data messages from room by id, then add message
			await fetchMessages(msg.channel);
			//messages.push({room_id: msg.channel, msg_content: [{sender: msg.sender, message: msg.message}] });
			//console.log(messages);
		}
		if (msg.channel != selected_room_id)
			createAlertOn(msg.channel);
		change_showing_messages(selected_room_id); //very bad logic but working. Messages of selected id is not updated but the messages data of all already fetched messages.
	}

	let createAlertOn = (roomId) =>
	{
		console.log("alert on ");
		console.log(roomId);
		newMsgAlert.push(roomId);
		newMsgAlert = newMsgAlert;
	}

	let deleteAlertOn = (roomId) =>
	{
		console.log("deletinf");
		newMsgAlert = newMsgAlert.filter(item => item !== roomId)
	}

	let isAlertOn = (roomId, alertSet) =>
	{
		console.log(roomId);
		console.log(alertSet.find(e => e == roomId) != undefined);
		return alertSet.find(e => e == roomId) != undefined;
	}

	

</script>

<div class="container">
	<div class="list_box">
		{#await rooms}
			<center><p>Loading...</p></center>
		{:then}
		<ul>
			{#each rooms as room (room.roomId)}
				<li class:activeroom={room.roomId === selected_room_id} class="one_room" on:click={() => change_showing_messages(room.roomId)} on:keypress>
					{room.roomName}
					<div class="alertBox" class:alertOn={isAlertOn(room.roomId, newMsgAlert)}></div>
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

	.one_room {
		font-size: 18px;
		padding: 15px;
		cursor: pointer;
		border-bottom: 1px #898f9f solid;
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
