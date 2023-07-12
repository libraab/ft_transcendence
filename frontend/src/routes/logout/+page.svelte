<script lang="ts">
	import { goto } from '$app/navigation';
	import { clientName, img_path, jwt_cookie, userId42 } from '$lib/stores.js';

    // goto("/");
    // console.log("logging out");
    $jwt_cookie = "";
	$img_path = "";
	$clientName = "";
	$userId42 = 0;
</script>

<div>
    <p>Logged out successfully</p>
	<a href="/"><button>return to Home page</button></a>
</div>

<style>

</style>
