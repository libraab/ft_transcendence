<script>
	import { hostname } from '../../hostname';
	import { onMount, afterUpdate } from 'svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let id;
	export let delTab;
	export let roomId;

	let admins = [];
	let members = [];

	async function getReplacementLists () {
		try
		{
			const response = await fetch(`http://${hostname}:3000/rooms/replacementList/${roomId}`);
			if (response.ok)
			{
				const data = await response.json();

				admins = data.admins;
				members = data.members;
			}
			else
			{
				console.error('failed to load replacement list');
			}
		}
		catch (error)
		{
			console.log(error);
		}
	};

	let firstLoad = true;
	onMount(async () => {
		await getReplacementLists();
		firstLoad = false;
	});

	afterUpdate(() => {
		if (!firstLoad) {
			getReplacementLists();
		}
	});

	let stayOption = 'stay'; // Default option is "and stay"

	function handleValidationClick() {
		dispatch('validationClick');
	}

	function resign(client)
	{
		try
		{
			if (stayOption === 'stay')
			{
				console.log(client.name, client.id, stayOption);
			}
			else
			{
				console.log(client.name, client.id, stayOption);
			}
		}
		catch (error)
		{
			console.error('ERROR: falied on resign', error.message);
		}
		handleValidationClick();
	}

	function eraseRoom()
	{
		console.log(roomId);
	}
</script>

	{#await getReplacementLists()}
		<div class="backdrop" on:click|self on:keypress={() => getReplacementLists()}>
			<p>Loading...</p>
		</div>

	{:then}
		{#if delTab === 'res'
		&& ((!admins || admins.length === 0)
			&& (!members || members.length === 0))}
		
			<div class="backdrop" on:click|self on:keypress>
				<div class="modal">
					<h1>empty room</h1>
					<p>do you want to delete it ?</p>
					<button on:click={()=> eraseRoom()}>yes</button>
					<button on:click={()=> handleValidationClick()}>no</button>
				</div>
			</div>
			
		{:else}
			{#if delTab === 'del'}
				<div class="backdrop" on:click|self on:keypress>
				<div class="modal">
					<h1>are you sure ?</h1>
					<button on:click={()=> eraseRoom()}>yes</button>
					<button on:click={()=> handleValidationClick()}>no</button>
				</div>
			</div>

			{:else if delTab === 'res'}
				<div class="backdrop" on:click|self on:keypress>
					<div class="modal">
						{#if admins.length > 0}
							<h1>To whom do you want to pass ownership ?</h1>
							<label>
								<input type="radio" value="leave" name="stayOption" on:change={() => stayOption = 'leave'} checked={stayOption === 'leave'} />
								and leave
							</label>
							<label>
								<input type="radio" value="stay" name="stayOption" on:change={() => stayOption = 'stay'} checked={stayOption === 'stay'} />
								and stay
							</label>

							<h3>admins</h3>
							{#each admins as admin}
								<button on:click={() => resign(admin)}>{admin.name}</button>
							{/each}
						{/if}

						{#if members.length > 0}
							<h3>members</h3>
							{#each members as member}
								<button on:click={() => resign(member)}>{member.name}</button>
							{/each}
						{/if}
					</div>
				</div>
			{/if}
		{/if}

	{:catch error}
		<p>Une erreur s'est prosuite {error.message}</p>
	{/await}


<style>
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
