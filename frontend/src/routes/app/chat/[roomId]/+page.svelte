<script lang='ts'>
	import { goto } from "$app/navigation";
	import ConnectStatus from "$lib/connectStatus.svelte";
	import { jwt_cookie, rooms, userId42 } from "$lib/stores";
	import { onMount, afterUpdate } from "svelte";
	import { socket, add_alert_On, deleteSocketEvents, deleteAlertOn } from '$lib/socketsbs'

    export let data: any;
    let roomId: string = data.roomId;
	let roomName = $rooms.find((el) => el.roomId == Number(roomId))?.roomName;
    
    let RoomsMessages: any = [];
    
    let user_message: string;
    
    console.log(roomId);

    onMount(() => {
        fetchData();
		deleteSocketEvents();
		deleteAlertOn(roomId);
		socket.on('serverToChat', recieveMessage); // on defini le comportement lors de l'event mais cette en sauvegardant le message
		socket.on('serverMessage', recieveServerMessage);
    })

	let recieveMessage = (msg) => {
		console.log("msg reiceived");
		if (msg.channel == roomId)
			RoomsMessages = [...RoomsMessages, {sender: msg.sender, message: msg.message}];
		else
			add_alert_On(msg.channel);
		console.log(RoomsMessages);
	}

	let recieveServerMessage = (msg) => {
		if (msg.channel == roomId)
			RoomsMessages = [...RoomsMessages, {sender: msg.sender, message: msg.message}];
	}

    async function fetchData() {
        try {
            const response = await fetch(`/api/chat/messages/${roomId}`, {
                    headers: { 'Authorization': `Bearer ${$jwt_cookie}` }
                });
            let messages = await response.json();
            console.log(messages);
            RoomsMessages = messages;
        }
        catch (error) {
            console.error(error);
            goto("/api/dashboard");
        }
    }
    
    let sendMessage = () => {
            socket.emit('chatToServer', {channel: roomId, sender: 'moi', message: user_message, sender_id: $userId42});
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
    
<style>
   
</style>