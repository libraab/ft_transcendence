<script>
	let rooms = [
		{ name: 'Transcandence', id: 1},
		{ name: 'some Guy', id: 2},
		{ name: 'some Groupe', id: 15},
		{ name: 'best friend', id: 23},
		{ name: 'Transcandence', id: 30},
		{ name: 'some Guy', id: 31},
		{ name: 'some Groupe', id: 32},
		{ name: 'best friend', id: 33},
		{ name: 'Transcandence', id: 34},
		{ name: 'some Guy', id: 35},
		{ name: 'some Groupe', id: 36},
		{ name: 'best friend', id: 37}
	]

	let messages = [
		{room_id: 1, msg_content:[ { sender: "silas", content: "Hi it's me silas"} , { sender: "dmercadi", content: "Hi! Do you want to talk about our savior Rick?"}, { sender: "silas", content: "Schrcool!"}] },
		{room_id: 15, msg_content:[ { sender: "asma", content: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", content: "What PiccleRick woudl do?"}, { sender: "Haythem", content: "He is one of them!!" }, { sender: "server", content: "Lionel has been kicked"} ]},
		{room_id: 37, msg_content:[ { sender: "asma", content: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", content: "What PiccleRick woudl do?"}, { sender: "Haythem", content: "He is one of them!!" }, { sender: "server", content: "Lionel has been kicked"},{ sender: "asma", content: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", content: "What PiccleRick woudl do?"}, { sender: "Haythem", content: "He is one of them!!" }, { sender: "server", content: "Lionel has been kicked"},{ sender: "asma", content: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", content: "What PiccleRick woudl do?"}, { sender: "Haythem", content: "He is one of them!!" }, { sender: "server", content: "Lionel has been kicked"},{ sender: "asma", content: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", content: "What PiccleRick woudl do?"}, { sender: "Haythem", content: "He is one of them!!" }, { sender: "server", content: "Lionel has been kicked"},{ sender: "asma", content: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", content: "What PiccleRick woudl do?"}, { sender: "Haythem", content: "He is one of them!!" }, { sender: "server", content: "Lionel has been kicked"},{ sender: "asma", content: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", content: "What PiccleRick woudl do?"}, { sender: "Haythem", content: "He is one of them!!" }, { sender: "server", content: "Lionel has been kicked"},{ sender: "asma", content: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", content: "What PiccleRick woudl do?"}, { sender: "Haythem", content: "He is one of them!!" }, { sender: "server", content: "Lionel has been kicked"},{ sender: "asma", content: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", content: "What PiccleRick woudl do?"}, { sender: "Haythem", content: "He is one of them!!" }, { sender: "server", content: "Lionel has been kicked"},{ sender: "asma", content: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", content: "What PiccleRick woudl do?"}, { sender: "Haythem", content: "He is one of them!!" }, { sender: "server", content: "Lionel has been kicked"},{ sender: "asma", content: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", content: "What PiccleRick woudl do?"}, { sender: "Haythem", content: "He is one of them!!" }, { sender: "server", content: "Lionel has been kicked"},{ sender: "asma", content: "Hi, i think math and dan are crazy, what to do?"} , { sender: "lionel", content: "What PiccleRick woudl do?"}, { sender: "Haythem", content: "He is one of them!!" }, { sender: "server", content: "Lionel has been kicked"} ]},
	]

	let selected_room_id = 0;
	let messages_room_id = [];

	let change_showing_messages = (id) => {
		selected_room_id = id;
		let room = messages.filter(data => data.room_id == id);
		if (room.length)
			messages_room_id = messages.filter(data => data.room_id == id)[0].msg_content;
		else
			messages_room_id = [];
	};

</script>

<div class="container">
	<div class="list_box">
		<ul>
			{#each rooms as room (room.id)}
				<li class:activeroom={room.id === selected_room_id} class="one_room" on:click={() => change_showing_messages(room.id)} on:keypress>
					{room.name}
				</li>
			{:else}
			<p>you don't have friends</p>
			{/each}
		</ul>
	</div>
	<div class="room_wrap">
		<ul class="messages">
			{#each messages_room_id as message}
				<li class="one_message" class:servermsg={message.sender === 'server'}>
					<strong>{message.sender}</strong>: {message.content}
				</li>
			{:else}
				{#if selected_room_id != 0}
					<p class="info">no messages, be the first one</p>
				{:else}
					<p class="info">no room selected</p>
				{/if}
			{/each}
		</ul>
		<div class="component_send_box">
			<input type="text" placeholder="write a message, or shut up">
			<button>send</button>
		</div>
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
		overflow: scroll;
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
