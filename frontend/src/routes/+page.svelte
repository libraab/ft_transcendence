<script lang="ts">
    import {PUBLIC_API_42, PUBLIC_DOMAIN_BACK} from '$env/static/public';
	import { onMount } from 'svelte';
    import {jwt_cookie, img_path} from "../stores";
	import { goto } from '$app/navigation';
    export let data;


    // const url = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-a5af938705ebd0c4b5b8a782f8b8026fb20fae93ce976a067e4d2033ee47c4d9&redirect_uri=http%3A%2F%2F${hostname}%3A3000%2Fauth&response_type=code`

    const url = `https://api.intra.42.fr/oauth/authorize?client_id=${PUBLIC_API_42}&redirect_uri=${encodeURI(PUBLIC_DOMAIN_BACK)}&response_type=code`;
    //jwt_cookie.set();

    // to get my jwt cookie:

    if (!$jwt_cookie)
        jwt_cookie.set(data.myJwtCookie);

    onMount(() => {
        if ($jwt_cookie){
            fetch('http://localhost:8080/api/dashboard', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${$jwt_cookie}`
                }
            }).then(async(data) => {
                const values = await data.json();
                img_path.set(values.img);
                goto('/dashboard');
            }).catch(err => {
                console.log(err);
            });
        }
    });

    

</script>

<form>
    <a href={url} class="login-button">
        Sign in with 42
    </a>

    <h1>My jwt {$jwt_cookie}!</h1>
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

    .login-button {
        display: block;
        width: 100%;
        max-width: 240px;
        padding: 16px;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        text-decoration: none;
        color: #fff;
        background-color: #007bff;
        border-radius: 8px;
        transition: background-color 0.2s ease-in-out;
        margin-top: auto;
        margin-bottom: auto;
    }

    .login-button:hover {
        background-color: #0062cc;
    }
</style>
