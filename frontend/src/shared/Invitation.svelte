<script>
	export let socket;
	export let opponent_id;
	export let data

	function sendInvitation()
	{
		socket.chat.emit('inviteToPlay', {player_id: data.id, opponent_id: opponent_id});
		//appeler une foncion de creation de la game + redirection vers la game
		//mais je sais pas faire
	}

</script>

<button on:click={sendInvitation}>Defier</button>

<style>

</style>