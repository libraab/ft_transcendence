<script lang='ts'>
	import { rooms } from '../../stores'
	import { goto } from '$app/navigation';
	// import { Link } from 'svelte-spa-router';

	
	let selected_room_id: number;

	let changeSelectedId = (id: number) => {
		selected_room_id = id;
		deleteAlertOn(id);
	};

	let deleteAlertOn = (roomId: number) =>
	{
		$rooms = $rooms.map((item: any) => 
		{
			if (item.roomId === roomId)
				return { ...item, newMsgCount: 0 };
			return (item);
	    });
	}

</script>

<div class="container">
	<div class="list_box">
		<ul>
			{#each $rooms as room (room.roomId)}
				<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
				<li class:activeroom={room.roomId === selected_room_id} class="one_room" on:click={() => goto('chat/${room.roomId}')} on:keypress>
					<a href={`chat/${room.roomId}`}>{room.roomName}</a>
					<!-- {#if room.secu !== 3}
						<button style="float: right;" on:click={() => leaveRoom(room)}>leave</button>
					{/if} -->
					<div class="alertBox" class:alertOn={room.newMsgCount !== 0}>{room.newMsgCount}</div>
				</li>
			{:else}
			<p>you are not subscribed to any rooms</p>
			{/each}
		</ul>
	</div>
	<slot></slot>
</div>

<style>

</style>