<!DOCTYPE html>
<script lang="ts">
	import { goto } from '$app/navigation';
	import { jwt_cookie, img_path, clientName, userId, userId42 } from '$lib/stores.js';

    $jwt_cookie = "";
	$img_path = "";
	$clientName = "";
	$userId42 = 0;
    $userId = 0;

</script>

<center>
    <div>
        <p>Goodbye :'&#40;</p>
        <iframe src="https://giphy.com/embed/lOpPaqaUwkX5PKywFh" width="480" height="480" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
    </div>
    <br>
    <br>
    <br>
    <br>
    <center>
        <button class="round-button" on:click={() => goto('/')}>Ok I'm sorry<br>I miss u. I'm coming back<br>Please forgive me</button>
    </center>
</center>

<style>
    .round-button {
        border: none;
        background-color: #2ccc00;
        border-radius: 20px;
        color: white;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        outline: none;
        padding: 10px 20px;
        margin: 10px;
        transition: background-color 0.3s ease;
    }
</style>
