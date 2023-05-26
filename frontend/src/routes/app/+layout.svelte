<script>

  import { goto } from "$app/navigation";

</script>
<nav class="tabs">

  <button on:click={()=> {goto("/app")}}>dashboard</button>
  <button on:click={()=> {goto("/app/game")}}>game</button>
  <button on:click={()=> {goto("/app/chat")}}>chat</button>
  <button on:click={()=> {goto("/app/rooms")}}>rooms</button>
</nav>
  
<slot/>

<style>
  .tabs{
		display: flex;
		justify-content: space-around;
		padding: 0 150px;
		margin: 0;
		background-color: #292d39;
		color: lightgray
	}
	button {
		position: relative;
    background: transparent;
    border: none;
		text-decoration: none;
		color: rgb(148, 146, 193);
		text-align: center;
		width: 120px;
		margin: 5px 20px;
		list-style-type: none;
	}

</style>