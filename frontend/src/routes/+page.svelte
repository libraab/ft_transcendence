<script lang="ts">
	import { onMount } from "svelte";
	import { hostname } from "../hostname";
	import { img_path, userId42, clientName } from "../stores";

	export let data;

	onMount(async () => {
		try
		{
			const response = await fetch(`http://${hostname}:3000/dashboard/${data.userId42}`);
			if (response.ok)
			{
				let vals = await response.json();
				$clientName = vals.name;
				$img_path = data.img_path;
				$userId42 = data.userId42;
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
	<center><h1>[{$clientName}]</h1></center>
	<center><h3>title</h3></center>
	<center><h3>update</h3></center>
	<center><h3>delete</h3></center>
	<center><h3>match history</h3></center>
</main>
  