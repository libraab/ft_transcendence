<script lang='ts'>
	import { userId } from "$lib/stores";

	export let historyTab: boolean;
    export let id: number;

	let historic: any = [];

	async function getClientHistory() {
		try {
			const response = await fetch(`/api/dashboard/history/${id}`)
			if (response)
			{
				historic = await response.json();
			}
			else
				historic = [];
		}
		catch (error) {
			console.error(error);
		}
	}
</script>


{#if historyTab}
	{#await getClientHistory()}

		<div class="backdrop" on:click|self on:keypress>
			<p>Loading...</p>
		</div>
  	{:then}
		<div class="backdrop" on:click|self on:keypress>

			<div class="modal">
				<h1>History</h1>
				{#if historic.length !== 0}
					{#each historic as match}
                        {#if match.client1.id === id}
                            <div class="score-container"> 
                                <div>
                                    <h4>{match.client1.name}</h4>
                                    <h2>{match.persScore}</h2>
                                </div>
                                <p>vs</p>
                                <div>
                                    <h4>{match.client2.name}</h4>
                                    <h2>{match.vsScore}</h2>
                                </div>
                            </div>
                        {:else}
                            <div class="score-container"> 
                                <div>
                                    <h4>{match.client2.name}</h4>
                                    <h2>{match.vsScore}</h2>
                                </div>
                                <p>vs</p>
                                <div>
                                    <h4>{match.client1.name}</h4>
                                    <h2>{match.persScore}</h2>
                                </div>
                            </div>
                        {/if}
					{/each}
                {:else}
                    <p>didn t play yet</p>
				{/if}
			</div>

        </div>
	{:catch error}
		<p>Une erreur s'est produite : {error.message}</p>
	{/await}
{/if}


<style>
    .score-container {
        display: flex;
        justify-content: center;
        gap: 20px;
    }
	.backdrop {
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.8);
		z-index: 1;
	}
	.modal {
		padding: 10px;
		border-radius: 10px;
		max-width: 400px;
		margin: 10% auto;
		text-align: center;
		background: white;
	}
</style>
