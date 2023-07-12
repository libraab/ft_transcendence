<script lang='ts'>
	import { goto } from "$app/navigation";
	import ConnectStatus from "$lib/connectStatus.svelte";
	import { jwt_cookie } from "$lib/stores";
	import { onMount, afterUpdate } from "svelte";

    export let data: any;
    let roomId = data.roomId;
    
    let RoomsMessages: any = [];
    
    let user_message: string;
    
    console.log(roomId);

    onMount(() => {
        console.log(roomId);
        fetchData();
    })

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
            // socket.chat.emit('chatToServer', {channel: ROOMID??PASTROUVE, sender: 'moi', message: user_message, sender_id: data.userId42});
            RoomsMessages = [...RoomsMessages, {sender: 'coco', message: user_message}];
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