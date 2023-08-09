<script lang='ts'>
	import { afterNavigate, goto } from "$app/navigation";
	import ConnectStatus from "$lib/connectStatus.svelte";
	import { jwt_cookie, rooms, userId42, userId, clientName } from "$lib/stores";
	import { onMount, onDestroy } from "svelte";
	import { socket } from '$lib/socketsbs'
    import Invite from '$lib/invitation.svelte'
	import type { AfterNavigate } from "@sveltejs/kit";
	// import { Socket, io } from 'socket.io-client'
	import { get, writable } from 'svelte/store';

    // export let data: any;
	export let data : any;
    let roomId: string = data.roomId;
    let RoomsMessages: any = data.messages;
    let members: any = data.members;
    let user_message: string;
	let my_status: number = data.status;
	
	// let socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined = undefined;
	
	onMount(() => {
		// fetchData();
		// fetchMembers();
		// socket = io('localhost:3000/chat', {path: '/chatsockets'});
		// socket.emit('whoAmI', get(userId));
		// deleteSocketEvents();
		// deleteAlertOn(roomId);
		if (socket)
		{
			socket.emit('joinChannel', String(roomId));
			socket.on('serverToChat', recieveMessage);
			socket.on('serverMessage', recieveServerMessage);
		}
	})

	onDestroy(() => {
		if (socket)
		{
			socket.emit('leaveChannel', String(roomId));
			socket.off('serverToChat', recieveMessage);
			socket.off('serverMessage', recieveServerMessage);
		}
	})

	let recieveMessage = (msg) => {
        // if (isBlockedUser(msg.sender_id))
        // {
        //     return;
        // }
			RoomsMessages = [...RoomsMessages, {sender: msg.sender, message: msg.message}];
		}

	let recieveServerMessage = (msg) => {
		RoomsMessages = [...RoomsMessages, {sender: msg.sender, message: msg.message}];
	}
    
    let sendMessage = () => {
		if (socket && user_message) {
			// RoomsMessages.push({sender: $userId42, message: user_message}) haha non merci
			// RoomsMessages = RoomsMessages
			socket.emit('chatToServer', {channel: roomId, message: user_message, sender_id: $userId42});
			user_message = "";
		}
    }

	afterNavigate( (navigation: AfterNavigate) => {
		roomId = data.roomId;
    	RoomsMessages = data.messages;
		members = data.members;
		my_status = data.status;
		console.log(my_status);
	})

	let sendQuitPost = async () => {
		await fetch(`/api/rooms/quit/${roomId}`,{
					method: 'POST',
					headers: {
              			'Authorization': `Bearer ${$jwt_cookie}`
          	},
			}).then((res) => {
				if (res.ok)
					console.error('quit successfully');
				else 
					console.error('failed to quit');
			}).catch(() => {
				console.error('failed to quit');
			});
	}

	let handleQuit = () => {
		if (data.status != 0)
		{
			sendQuitPost();
			goto("/app/chat");
		}
		else
			sendQuitPost();
	}
</script>
    
<div class="room_wrap"> 
    <!-- rajouter un link bouton fermer qui retourne sur /chat -->
    <ul class="messages">
        {#each RoomsMessages as message}
                <li class="one_message" class:servermsg={message.sender === 'server'} class:myMessage={message.sender === $clientName}>
                    {message.sender}: {message.message}
                </li>
        {:else}
                <p class="info">no messages, be the first one</p>
        {/each}
    </ul>
    <form on:submit|preventDefault={sendMessage} class="component_send_box">
        <input type="text" placeholder="Type something ..." bind:value={user_message}>
        <button>send</button>
    </form>
</div>
<div class="members">
    <ul>
        {#each members as member}
		<li class="one_member">
			{#if my_status === 0 || my_status === 1}
				{#if member.status === 6}
					<button>✅</button>
					<button>❌</button>
				{:else if member.status === 5}
					<button>❌</button>
				{:else if member.status !== 0 && member.status !== 1}
					<button>🚪</button>
					<button>❌</button>
					<button>🔇</button>
				{/if}
			{/if}
            <a href="/app/dashboard/{member.member.name}">{member.member.name}</a>
           	{#if member.member.id != $userId && member.status !== 6 && member.status !== 5}
                <Invite opponent_id={member.member.id} />
            {/if}
			<ConnectStatus userId={member.member.id} />
        </li>
        {/each}
    </ul>
	<button on:click={handleQuit} class="btn-room-quit">Quit</button>
</div>
    
<style>
	.members {
		width: 30vw;
		background-color: #404040;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}

	.room_wrap {
		width: 100%;
		margin: 30px 0;
		display: flex;
		flex-direction: column;
		justify-content: end;
	}

     a {
	color: rgb(0,100,200);
	text-decoration: none;
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
		color: #ffffff;
		padding: 5px;
		max-height: 60vh;
	}

	.component_send_box {
		background-color: #FFFFFF;
		overflow: hidden;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: baseline;
		padding: 5px 10px;
	}

	.component_send_box input {
		border: none;
		width: 100%;
		max-width: 80%;
		font-family: 'Oxanium';
	}

	input:focus {
    	outline: none;
	}

	.component_send_box button {
		border: none;
		border-radius: 10px;
		width: 80px;
		height: 30px;
		background: #DBDBDB;
		font-family: 'Oxanium';
	}

	.messages {
		display: flex;
		flex-direction: column;
		max-height: 60vh;
		overflow: auto;
	}

	.one_message {
		background-color: #404040;
		max-width: 50%;
		border-radius: 5px;
		margin: 10px 0;
		padding: 15px 20px;
	}

	.myMessage {
		background-color: #3AB45C;
		align-self: flex-end;
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


	/* Member Block */

	.one_member {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	.one_member a {
		text-decoration: none;
		color: white;
	}

	.btn-room-quit {
		border: none;
		background-color: #939393;
		color: white;
		font-family: 'Oxanium';
		padding: 15px 60px;
		margin: 10px 10px;
		text-transform: uppercase;
	}

</style>