<script>
	import { createEventDispatcher } from "svelte";
	import { hostname } from "../../hostname"
	const dispatch = createEventDispatcher();

	export let updatePop;
	export let id;

	let badUpdate = false;

	async function submitForm()
	{
		const nameInput = document.getElementById("name-upload");
		const fileInput = document.getElementById("file-upload");

		const formData = new FormData();
		formData.append("name", nameInput.value);
		formData.append("img", fileInput.files[0]);

		const jsonData = {};
		for (let [key, value] of formData.entries())
		{
			jsonData[key] = value !== "undefined" ? value : null;
		}

		try
		{
			const response = await fetch(`http://${hostname}:3000/dashboard/update/${id}`,
			{
				method: "POST",
				body: JSON.stringify(jsonData),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.ok)
			{
				console.log("no prob bro, i got this");
				dispatch('updated');
				// Gérer la réponse du backend en cas de succès
			}
			else
			{
				console.log("something went wrong");
				badUpdate = true;
				// Gérer la réponse du backend en cas d'erreur
			}
		}
		catch (error)
		{
			console.error(error);
		}
	}

	function closePopUp() {
		badUpdate = false;
	}
</script>


{#if updatePop && !badUpdate}
	<div class="backdrop" on:click|self on:keypress>
		<div class="modal">
			<h1>Update Profile</h1>
			<p>Change de peau</p>

			<label for="name upload">What's your new name?</label>
			<div class="file-input-container">
				<input type="text" name="name-upload" id="name-upload">
			</div>

			<label for="file upload">Select a File</label>
			<div class="file-input-container">
				<input type="file" name="file-upload" id="file-upload">
			</div>

			<button on:click={() => {submitForm()}} on:click|self>Validate</button>

		</div>
	</div>

{:else if badUpdate}
	
	<div class="backdrop" on:click|self on:keypress>
		<div class="modal">
			<h1>sry something went wrong</h1>
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
