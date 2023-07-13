<script lang='ts'>
	import { rooms } from '$lib/stores'
	import { onMount } from 'svelte';
	import { reloadRooms, updateCount } from '$lib/socketsbs';


	onMount( () =>
	{
		/**
		 * Reloading $rooms here is not mandatory but is recomended
		 * otherwise reload is trigered when some rooms changes are done on the backend and signaled trought the socket to the user if connected
		*/
		reloadRooms();
	})
</script>

<div class="container">
	<div class="list_box">
		<ul>
			{#each $rooms as room (room.roomId)}
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<li class="one_room">
					<a href='/app/chat/{room.roomId}'>{room.roomName}</a>
					<!-- {#if room.secu !== 3}
						<button style="float: right;" on:click={() => leaveRoom(room)}>leave</button>
					{/if} -->
					<div class="alertBox" class:alertOn={room.newMsgCount !== 0}>{room.newMsgCount}</div>
				</li>
			{:else}
			<p>You don't have rooms</p>
			{/each}
		</ul>
	</div>
	<slot></slot>
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
		margin: 0px 100px;
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
		position: relative;
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

	/* .activeroom {
		background-color: #898f9f;
	} */

	li {
		list-style: none;
	}

	/* .room_wrap {
		width: 100%;
		// max-height: 60vh;
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
	} */
</style>