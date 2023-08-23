<script lang="ts">
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher();

	export let updatePop: boolean;
	export let id: number;

	let badUpdate = false;
	let indexBadUpdate = 0;

	async function submitForm()
	{
		const nameInput = document.getElementById("name-upload") as HTMLInputElement;
		const fileInput = document.getElementById("file-upload") as HTMLInputElement;

		let data = new FormData();
		data.append("file", fileInput.files[0]);

		if (fileInput && fileInput.files && fileInput.files[0]) {
			try
			{
				const response = await fetch (`/api/dashboard/update/${id}`, {
					method: 'POST',
					body: data
				});
				if (!response.ok)
				{
					indexBadUpdate += 1;
					badUpdate = true;
				}
			}
			catch (error)
			{
				console.error(error);
			}
		}

		if (nameInput) {
			try
			{
				const response = await fetch (`/api/dashboard/updateName/${id}`, {
					method: 'POST',
					body: nameInput.value
				});
				if (!response.ok)
				{
					indexBadUpdate += 2;
					badUpdate = true;
				}
			}
			catch (error)
			{
				console.error(error);
			}
		}

		dispatch('updated');
	}

	function closePopUp() {
		badUpdate = false;
		indexBadUpdate = 0;
	}

</script>


{#if updatePop && !badUpdate}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="backdrop" on:click|self>
		<div class="modal">
			<h1>Update Profile</h1>
			<p>U can be anything</p>

			<label for="name upload">What's your new name?</label>
			<div class="file-input-container">
				<input type="text" name="name-upload" id="name-upload">
			</div>
			<br>
			<label for="file upload">What's your new face?</label>
			<br>
			<br>
			<div class="file-input-container">
				<input type="file" name="file-upload" id="file-upload">
			</div>

			<button on:click={submitForm} on:click|self>Validate</button>

		</div>
	</div>

{:else if badUpdate}
	
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="backdrop" on:click|self>
		<div class="modal">
			<h1>sry something went wrong</h1>
			{#if indexBadUpdate === 1}
				<p>img not updated</p>			
			{:else if indexBadUpdate === 2}
				<p>name not updated</p>
			{:else if indexBadUpdate === 3}
				<p>neither name nor img</p>	
				<p>nothing updated</p>
			{/if}
			<button on:click={() => closePopUp()}>close</button>
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
	.modal label {
		color: black; /* ou une autre couleur de votre choix */
	}
	.file-input-container {
		display: flex;
		color: black;
		justify-content: center;
	}
</style>