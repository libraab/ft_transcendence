<script lang='ts'>

    export let RoomsMessages: any;
    
    let user_message: string;
    
    
    let sendMessage = () => {
            // socket.chat.emit('chatToServer', {channel: ROOMID??PASTROUVE, sender: 'moi', message: user_message, sender_id: data.userId42});
            // user_message = ""
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