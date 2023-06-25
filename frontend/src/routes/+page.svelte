<script lang="ts">
	import { redirect } from '@sveltejs/kit';

	export let data;

	$: {
		(async () => {
			if (data.status === 307) {
				throw redirect(data.status, data.redirect);
			}
		});
	}
</script>

<main>
		<center><h1>[my profile]</h1></center>
		<center><h3>name</h3></center>
		<center><h3>title</h3></center>
		<center><h3>update</h3></center>
		<center><h3>delete</h3></center>
		<center><h3>match history</h3></center>
</main>
  