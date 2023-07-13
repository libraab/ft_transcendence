<script lang='ts'>
	import { goto } from "$app/navigation";
	import ConnectStatus from "$lib/connectStatus.svelte";
	import { jwt_cookie, rooms, userId42 } from "$lib/stores";
	import { onMount, onDestroy } from "svelte";
	import { socket, add_alert_On, deleteSocketEvents, deleteAlertOn, defineSocketEvents, isBlockedUser } from '$lib/socketsbs'
    import Invite from '$lib/invitation.svelte'

    export let data: any;
    let roomId: string = data.roomId;
	// let roomName = $rooms.find((el) => el.roomId == Number(roomId))?.roomName;
    let RoomsMessages: any = [];
    let members: any = [];
    let user_message: string;

    onMount(async () => {
        await fetchData(roomId);
        await fetchMembers(roomId);
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
        fetchData(roomId);
        deleteAlertOn(roomId);
    }

    async function fetchMembers(room_id) {
		try {
			const response = await fetch(`/api/chat/room/${room_id}`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${$jwt_cookie}`
				}
			});
            if (response.ok)
            {
			    let rjson = await response.json();
                members = rjson;
            }
            else
            {
                console.error("fetch failed on fetchMember");
                console.error(response.status);
                goto("/");
            }
		}
		catch (error) {
			console.error(error);
		}
	}

    // afterUpdate(async () => {
    //     console.log("UPDATES");
    //     console.log(roomId);
    //     roomId = data.roomId;
    //     console.log(roomId);
    //     await fetchData(roomId);
    // });


    /**
     * The behaviour of serverToChat event is now different. When we recieve message and if we are in the rooom corresponding to message :
     *  - we add the message directly to the array of fetched messages so we dont need to fetche again (all throught sockets)
     */
	let recieveMessage = (msg) => {
		console.log("msg reiceived");
        if (isBlockedUser(msg.sender_id))
        {
            console.log("Oh no, i blocked him, dont wanna hear");
            return;
        }
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

    /**
     * Extract all messages from a room database
     * blocked users are excluded
     */
    async function fetchData(roomId) {
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
            goto("/api/chat");
        }
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
   
</style>