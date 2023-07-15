<script>
	import { page } from '$app/stores';
</script>

<center>
	<div>
        {#if $page.error}
		    <h2>{$page.error.message}</h2>
        {/if}
	</div>
</center>