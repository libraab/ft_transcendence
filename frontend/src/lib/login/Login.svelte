<script lang="ts">
    import {PUBLIC_HOSTNAME} from '$env/static/public';
	import { onDestroy } from 'svelte';

    const url = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-a5af938705ebd0c4b5b8a782f8b8026fb20fae93ce976a067e4d2033ee47c4d9&redirect_uri=http%3A%2F%2F${PUBLIC_HOSTNAME}%3A3000%2Fauth&response_type=code`;

	let win: Window | null;
	let intervalId: number;

	function createWindow() {
		win = window.open(url, 'Login width transcendance', 'width=500,height=850')
		intervalId = setInterval(() => {
            if (win && win.closed) {
                clearInterval(intervalId);
                windowClosed();
            }
        }, 500);
    }

    onDestroy(() => {
        if (intervalId) {
            clearInterval(intervalId);
        }
    });

    function windowClosed() {
        console.log("Window closed");
		// get cookie and set jwt in storage
    }
</script>

<form>
	<button on:click="{createWindow}">
		Sign in with 42
	</button>
</form>

<style>

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 150px;
        border: none;
        border-radius: 8px;
    }

    button {
        min-width: 240px;
        padding: 16px;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        text-decoration: none;
        color: #fff;
        background: #007bff;
        border-radius: 8px;
		cursor: pointer;
		border: none;
		transition: background 0.2s ease-in-out;
    }

    button:hover {
        background: #0062cc;
    }
</style>
