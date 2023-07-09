 <script lang="ts">
	import { onMount } from "svelte";


	let retData: any;
	export let data: any;

	async function checkBackend()
	{
		const response = await fetch("http://localhost:3000/");
		if (response.ok)
		{
			retData = await response.json()
		}
		else
		{
			console.error("fetch failed");
		}
	};

	function nullify()
	{
		retData = "";
	}

	onMount(() => {		
		console.log(data)
	});	

</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
{#if data.val}
	<p>{data.val}</p>
{/if}

{#if  retData}
	<button on:click={() => nullify()}> test</button>
	<p>{retData.message}</p>
{:else}
	<button on:click={() => checkBackend()}> test</button>
{/if}
