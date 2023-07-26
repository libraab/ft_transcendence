<script lang="ts">
	import { goto } from "$app/navigation";
    import { userId } from "$lib/stores";

	export let deletePop: boolean;

    async function supprUser() {
        const response = await fetch(`/api/dashboard/deleteUser/${$userId}`, {
            method: 'POST',
        });
        if (response.ok) {
            goto('/logout');
        }
        else {
            console.error(response.status, response.statusText);
        }
    }
</script>

{#if deletePop}
	<div class="backdrop" on:click|self on:keypress>
		<div class="modal">
			<h1>Plz stay...</h1>
			<p>we can work this out</p>
			<p>its me, not you</p>
			<p>That's kinda hard for me right now</p>
            <p>you know ...</p>
			<p>but i can change</p>
			<p>i ll be better i promise</p>
			<p>i love u</p>
            <br>
            <br>
            <h4>No! I have no heart. Farewell</h4>
            <button class="round-button" on:click={()=> supprUser()}>┌∩┐(◕_◕)┌∩┐</button>
		</div>
	</div>
{/if}

<style>
	.backdrop {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.8);
	}
	.modal {
		padding: 10px;
		border-radius: 10px;
		max-width: 400px;
		margin: 10% auto;
		text-align: center;
		background: white;
	}
	.modal h1 {
		color: black; /* ou une autre couleur de votre choix */
	}
	.modal p {
		color: black; /* ou une autre couleur de votre choix */
	}
    .round-button {
		border: none;
		background-color: #ff0000;
		border-radius: 20px;
		color: white;
		font-size: 16px;
		font-weight: bold;
		cursor: pointer;
		outline: none;
		padding: 10px 20px;
		margin: 10px;
		transition: background-color 0.3s ease;
	}
</style>