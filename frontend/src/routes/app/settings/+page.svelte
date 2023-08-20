<script lang="ts">
	import { goto } from "$app/navigation";
	import { client } from "$lib/gamesocket";
	import { clientName, img_path, jwt_cookie, userId } from "$lib/stores";
	import { onMount } from "svelte";

// let blocked_users = [{block_id: 3, block_name: "LeGugusQuiMeSaoule"},
// {block_id: 4, block_name: "LautreGus"},
// {block_id: 5, block_name: "LeTricheur"},
// {block_id: 6, block_name: "LeSpammeur"},
// 					];
	export let data;
	let DfaInfo = data.DfaInfo;
	let qrCodeImageUrl = "";

	let badUpdate = false;
	let indexBadUpdate = 0;
	let new_img_data: any;
	let fileInput : any = null;
	let files : any;

	let blocked_users: any = [];

	console.log('data')
	console.log(data);
	console.log('DfaInfo')
	console.log(DfaInfo);

	onMount(() =>
	{
		fetchBlockedUsers();
	})
	async function fetchBlockedUsers() {
		try {
			const response = await fetch(`/api/dashboard/blockedusers`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${$jwt_cookie}`
				}
			});
			if (response.status == 200)
			{
				let block_list = await response.json();
				console.log(block_list);
				blocked_users = block_list;
			}
			else
				console.error(response.status, response.statusText);
			return null;
		}
		catch (error) {
			console.error(error);
		}
	}

	async function submitForm()
	{
		const nameInput = document.getElementById("input-name") as HTMLInputElement;
		const fileInput = document.getElementById("file-upload") as HTMLInputElement;

		let data = new FormData();
		console.log(fileInput);
		data.append("file", fileInput.files[0]);

		if (fileInput && fileInput.files && fileInput.files[0]) {
			try
			{
				const response = await fetch (`/api/dashboard/update/${$userId}`, {
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
				console.log(error);
			}
		}

		if (nameInput) {
			try
			{
				const response = await fetch (`/api/dashboard/updateName/${$userId}`, {
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
				console.log(error);
			}
		}
		goto('/app/dashboard');
	}

	//for previsualisation we extract file data
	function getBase64(image: any) {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = e => {
            new_img_data = e.target.result;
        };
    };

	// $:{console.log(files)}

	const unblockUser = async (unblockedId: number) => {
		const response = await fetch(`/api/chat/unblockUser`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${$jwt_cookie}`
			},
			body: JSON.stringify({
				unblockedId: unblockedId,
				iddata: $userId
			})
		});
		if (response.ok) {
			console.log('User unblocked');
			blocked_users = blocked_users.filter((user: any) => user.client2.id !== unblockedId);
		} else {
			console.error('Failed to unblock user');
		}
	};


	async function toggleDFAState() {
		console.log("TOGGLEDFA");
		// Send API request to update DFA status
		console.log (DfaInfo.dfa);
		DfaInfo.dfa = !DfaInfo.dfa;
		console.log (DfaInfo.dfa);
		try {
			const response = await fetch(`/api/auth/2fa/${$userId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					// 'Authorization': `Bearer ${$jwt_cookie}`
				},
				body: JSON.stringify({
					isDFAActive: DfaInfo.dfa,
				})
			});
			if (response.ok) {
				data = await response.json();
				console.log(data);
				qrCodeImageUrl = data.qrCodeImageUrl;
			} else {
				console.error('Failed to get 2fa for the user');
			}
			// const response = await axios.post(`/api/auth/2fa/${$userId}`, { DfaInfo.dfa });
			// qrCodeImageUrl = response.data.qrCodeImageUrl;
		} catch (error) {
			console.error('Failed to update DFA status:', error);
		}
	}

</script>

<div class="settings-wrap">
	<div class="settings-data">
		<div class="inputs">  
			<label><h4>Name :</h4>
				<input id="input-name" name="input-name" type="text" placeholder='{$clientName}'>
			</label>
		</div>
		<div class="inputs inputs-avatar">
			<h4>Avatar :</h4>
			<label>
				{#if fileInput && fileInput.value != ''}
					<div class="selected-img"><img src={new_img_data} alt="logo" class="rick"><button class="btn-image-delete-selected" on:click={ () => fileInput.value = '' }>x</button></div>
				{:else if $img_path}
					<img src={$img_path} alt="logo" class="rick">
				{:else}
					<img src='/logo.jpeg' alt="logo" class="rick">
				{/if}
				<p><input type="file" accept=".png,.jpg" id="file-upload" name="file-upload" bind:this={fileInput} bind:files on:change={() => getBase64(files[0])}></p>
				<!-- <input type="file" name="file-upload" id="file-upload"> -->
			</label>
		</div>
		<div class="btn-wrap"><button id="btn-save" on:click={submitForm} >SAVE</button></div>
		<div class="inputs">
			<h4>Dfa</h4>
			{#if DfaInfo.dfa}
				<p>On</p>
				<label class="switch">
					<input type="checkbox" on:click={toggleDFAState} checked/>
					<span class="slider round"></span>
				</label>
			{:else}
				<p>Off</p>
				<label class="switch">
					<input type="checkbox" on:click={toggleDFAState} />
					<span class="slider round"></span>
				</label>
			{/if}
			<!-- <label class="switch">
				<input type="checkbox" on:click={toggleDFAState}  />
				<span class="slider round"></span>
			</label> -->
			{#if qrCodeImageUrl}
				<div class="qrcode-wrapper">
					<img class="img-qrcode" src={qrCodeImageUrl} alt="QR Code" />
				</div>
			{/if}
		</div>
	</div>
	<div class="block-list">
		<h3>Blocked Users :</h3>
			<ul>
				{#each blocked_users as blocked_user}
				<li>
					<button class="btn-unblock" on:click={() => unblockUser(blocked_user.client2.id)}>Unblock</button>
					{blocked_user.client2.name}
				</li>
				{/each}
			</ul>
	</div>
</div>

<style>
	.settings-wrap {
		background-color: #EFEFEF;
		margin: 30px 100px;
		padding: 50px;
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
	}

	h4 {
		font-weight: normal;
		font-size: 18px;
		text-transform: capitalize;
		margin-bottom: 10px;
	}

	.inputs {
		margin-bottom: 20px;
	}

	#input-name {
		padding: 5px 10px;
		border-radius: 0%;
		border: #DCDCDC 1px solid;
		text-align: end;
	}
	#input-name::placeholder {
		text-align: end;
	}

	.inputs-avatar {
		text-align: center;
	}

	h4 {
		text-align: left;
	}

	.rick {
		width: 90px;
		height: 90px;
		border-radius: 50%;
		/* margin-right: 20px; */
		object-fit: cover;
		/* box-shadow: 0 0 20px rgba(0, 255, 0, 0.5); */
	}

	#btn-choose-img {
		border: none;
		background-color: #D7D7D7;
		border-radius: 10px;
		padding: 7px 10px;
		font-family: 'Oxanium';
		font-size: 10px;
		cursor: pointer;
	}

	.selected-img {
		position: relative;
	}

	.btn-image-delete-selected {
		position: absolute;
		top: 0;
		right: 0;
		border: none;
		background-color: #DF0000;
		border-radius: 50%;
		color: white;
		cursor: pointer;
		font-size: 8px;
		font-weight: bold;
		font-family: 'Oxanium';
		width: 20px;
		height: 20px;
		padding: 5px;
	}

	.btn-wrap {
		text-align: center;
	}

	#btn-save {
		background-color: #3AB45C;
		padding: 15px 25px;
		color: white;
		border: none;
		cursor: pointer;
	}

	.block-list
	{
		border-left: #DF0000;
	}

	.block-list h3
	{
		font-weight: normal;
		font-size: 20px;
		text-align: center;
	}

	.block-list ul {
		list-style: none;
	}

	.block-list ul li {
		font-size: larger;
		margin-top: 15px;
	}

	.block-list ul li button {
		font-family: 'Oxanium';
		border: none;
		font-weight: lighter;
		background-color: #DF0000;
		color: white;
		padding: 10px 20px;
		margin-right: 10px;
		cursor: pointer;
	}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}



/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.qrcode-wrapper {
	text-align: center;
	padding: 15px;
}

</style>