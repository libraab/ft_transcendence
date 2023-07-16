<script lang='ts'>
	import { goto } from "$app/navigation";
	import ConnectStatus from "$lib/connectStatus.svelte";
	import { jwt_cookie, rooms, userId42 } from "$lib/stores";
	import { onMount, onDestroy } from "svelte";
	import { socket, add_alert_On, deleteSocketEvents, deleteAlertOn, defineSocketEvents, isBlockedUser } from '$lib/socketsbs'
    import Invite from '$lib/invitation.svelte'
	import { error } from "@sveltejs/kit";

    export let data: any;
    let roomId: string = data.roomId;
	// let roomName = $rooms.find((el) => el.roomId == Number(roomId))?.roomName;
    let RoomsMessages: any = data.messages;
    let members: any = [];
    let user_message: string;

    onMount(async () => {
        // await fetchData(roomId);
        // await fetchMembers(roomId);
		deleteSocketEvents();
		deleteAlertOn(roomId);
		socket.on('serverToChat', recieveMessage);
		socket.on('serverMessage', recieveServerMessage);
    })

    onDestroy(() => {
		socket.off('serverToChat', recieveMessage);
        socket.off('serverMessage', recieveServerMessage);
		defineSocketEvents();
	})

    $:{
        roomId = data.roomId;
        fetchData();
        fetchMembers();
        deleteAlertOn(roomId);
    }

function fetchMembers() {
  fetch(`/api/chat/room/${data.roomId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${$jwt_cookie}`
      }
    })
  .then(async (response) => {
      if (response.ok)
      {
        let rjson = await response.json();
        members = rjson;
      }
      else
      {
        console.error("fetch failed on fetchMember");
        console.error(response.status);
        // goto("/");
      }
    })
  .catch((error) => {
    console.log(error);
    // goto("/app/chat")
  });
}

    /**
     * The behaviour of serverToChat event is now different. When we recieve message and if we are in the rooom corresponding to message :
     *  - we add the message directly to the array of fetched messages so we dont need to fetche again (all throught sockets)
     */
	let recieveMessage = (msg) => {
        if (isBlockedUser(msg.sender_id))
        {
            return;
        }
		if (msg.channel == roomId)
			RoomsMessages = [...RoomsMessages, {sender: msg.sender, message: msg.message}];
		else
			add_alert_On(msg.channel);
	}

	let recieveServerMessage = (msg) => {
		if (msg.channel == roomId)
			RoomsMessages = [...RoomsMessages, {sender: msg.sender, message: msg.message}];
	}

    /**
     * Extract all messages from a room database
     * blocked users are excluded
     */
	 function fetchData() {
  	console.log("load chat[roomid]/page fetchData");
  fetch(`/api/chat/messages/${data.roomId}`, {
    headers: { 'Authorization': `Bearer ${$jwt_cookie}` }
  })
    .then(async (response) => {
      if (response.ok)
      {
        console.log("load chat[roomid]/page fetchData ok");
        let messages = await response.json();
        console.log('before')
        console.log(messages);
        console.log('after');
        RoomsMessages = messages;
      }
      console.log(response.status)
    })
    .catch((error) => {
      console.error(error);
      // goto("/app/chat");
    });
  }
    
    let sendMessage = () => {
            socket.emit('chatToServer', {channel: roomId, message: user_message, sender_id: $userId42});
            user_message = "";
    }
    
	
</script>
    
<div class="room_wrap"> 
    <!-- rajouter un link bouton fermer qui retourne sur /chat -->
    <ul class="messages">
        {#each RoomsMessages as message}
                <li class="one_message" class:servermsg={message.sender === 'server'}>
                    <strong>{message.sender}</strong>: {message.message}
                </li>
        {:else}
                <p class="info">no messages, be the first one</p>
        {/each}
    </ul>
    <form on:submit|preventDefault={sendMessage} class="component_send_box">
        <input type="text" placeholder="write a message, or shut up" bind:value={user_message}>
        <button>send</button>
    </form>
</div>
<div class="members">
    <ul>
        {#each members as member}
        <li class="one_member">
            <strong>{member.member.name}</strong><ConnectStatus userId={member.member.id} />
            {#if member.status == 0}
            ♚
            {:else if member.status == 1}
            ♟
            {/if}
            <!-- si on est admin ou owner   -->
           {#if member.member.id != data.id}
                <button on:click={() => goto(`/app/dashboard/${member.member.name}`)}>Profil</button>
                <Invite opponent_id={member.member.id} />
            {/if}
        </li>
        {/each}
    </ul>
</div>
    
<style>
     a {
	color: rgb(0,100,200);
	text-decoration: none;
    }

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