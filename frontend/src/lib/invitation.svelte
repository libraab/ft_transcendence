<script lang='ts'>
	import { goto } from '$app/navigation';
	import { socket } from '$lib/socketsbs'
    import { userId } from '$lib/stores';
	import { StartPlayProcess, roomData } from '$lib/gamesocket';
	
	
    export let opponent_id: number;

	async function sendInvitation()
	{
		// socket.chat.emit('inviteToPlay', {player_id: $userId, opponent_id: opponent_id, secret: secret});
		// goto(`/app/game/${secret}`);
        await StartPlayProcess(opponent_id);
        goto(`/app/game/${roomData.id}`);
	}

</script>

<button on:click={sendInvitation}>⚔️</button>

<style>
	button {
		border: none;
		background-color: none;
	}
</style>