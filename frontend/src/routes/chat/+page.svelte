<script>
	import { onMount } from "svelte";
	import { hostname } from "../../hostname";
	import { img_path, userId42, clientName } from "../../stores";

	export let data;

	onMount(async () => {
		img_path.set(data.img_path);
		userId42.set(data.userId42);

		try
		{
			const response = await fetch(`http://${hostname}:3000/dashboard/${data.userId42}`);
			if (response.ok)
			{
				let vals = await response.json();
				$clientName = vals.name;
			}
			else
				console.error("layout");

		}
		catch (error)
		{
			console.error("layout" , error);
		}
	});
</script>
  
<main>
	<div class="chat">
		<h2>Chat</h2>
		<h5>{$userId42}</h5>
		<p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi corrupti tempora unde placeat commodi dicta quia omnis a odit. Repudiandae hic optio, exercitationem ipsam at iste cupiditate sint debitis vero.</p>
	</div>
</main>
  
<style>
	.chat {
		text-align: center;
		display: block;
		margin: 20px auto;
	}
</style>