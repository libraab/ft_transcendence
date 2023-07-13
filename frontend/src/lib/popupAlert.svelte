<script lang='ts'>
    import { goto } from "$app/navigation";
    
	export let invitationData: any;
  export let show: boolean;
</script>

<div class="popup" class:hidden={!show}>
	<p>You got an invitation to a game from {invitationData.name}</p>
	<div class="buttons">
	  <button on:click={() => goto(`/app/game/${invitationData.secret}`)} class="accept-button">Accept</button>
	  <button class="decline-button">Decline</button>
	</div>
</div>

<style>
	.popup {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  padding: 20px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.hidden {
  display: none;
}

.popup p {
  margin: 0;
}

.buttons {
  margin-top: 20px;
}

.buttons button {
  margin: 0 5px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.buttons button:hover {
  background-color: #0056b3;
}
</style>