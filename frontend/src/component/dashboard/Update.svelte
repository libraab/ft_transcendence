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

		let data = new FormData();


		data.append("file", fileInput.files[0]);
		fetch (`http://${hostname}:3000/dashboard/update/${id}`, {
			method: 'POST',
			body: data
		}).then((response) => {
			console.log('OK');
			
		} )
		.catch((error) => { 		
		console.log('PAS OK');
		});

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

			<button on:click={submitForm} on:click|self>Validate</button>

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


<!-- 
 <script>
	import { onMount } from 'svelte';
	import axios from 'axios';
	import { hostname } from "../../hostname"
  
	let selectedFile;
  
	async function handleFileUpload() {
		console.log('in upload pic');
	  	const formData = new FormData();
	  	formData.append('profilePicture', selectedFile);
  
	  	try {
			await axios.post(`http://${hostname}:3000/dashboard/update`, formData, {
		  	headers: {
				'Content-Type': 'multipart/form-data'
		  	}
			});
			console.log('Profile picture uploaded successfully');
	  	} catch (error) {
			console.error('Error uploading profile picture:', error);
	  	}
	}
  
	onMount(() => {
	  // Additional code to handle file selection
	  const fileInput = document.getElementById('profilePicture');
	  fileInput.addEventListener('change', (event) => {
		selectedFile = event.target.files[0];
	  });
	});

  </script>
  
  <main>
	<h1>Profile Picture Upload</h1>
  
	<form on:submit|preventDefault={handleFileUpload}>
	  <input type="file" id="profilePicture" accept="image/*">
	  <button type="submit">Upload</button>
	</form>
  </main>
  
  <style>
	main {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	  padding: 2rem;
	}
  
	h1 {
	  font-family: "Arial", sans-serif;
	  font-size: 2rem;
	  text-align: center;
	  margin-bottom: 1rem;
	}
  
	form {
	  display: flex;
	  flex-direction: column;
	  align-items: center;
	  justify-content: center;
	}
  
	input[type="file"] {
	  margin-bottom: 1rem;
	}
  
	button {
	  padding: 0.5rem 1rem;
	  border-radius: 5px;
	  background-color: pink;
	  color: white;
	  font-family: "Arial", sans-serif;
	  font-size: 1rem;
	  border: none;
	  cursor: pointer;
	}
  </style> -->