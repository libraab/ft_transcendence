<script lang="ts">
    import {jwt_cookie, img_path, userId42} from '$lib/stores';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	// import { error } from '@sveltejs/kit';

    export let data: any; //exported data is the cookie

    onMount( async () =>
    {
        //on stock le cookie dans un local Storage pour y avoir plus facilement acces
        jwt_cookie.set(data.myJwtCookie);
        userId42.set(data.myid42);

        // Premier cas : on a pas de cookie le local Storage est undefined et on attent que le User clique sur SignIn qui va lui permettre de faire la procedure d'auth et de recuperer un cookie
        
        // Deuxieme cas : on a un cookie. On verifie que la connexion a l.api fonctionne grace a ce cookie
        //                  Si le retour est ok on redirige le user dans l'application
        //                  Si le retour est ko cela veut dire qu'on a un mauvais cookie (expire ou bien un pirate que sait-je) et donc on attend quil sign in pour reprendre un nouveau cookie
        if ($jwt_cookie)
        {
            try {
                const connect = await fetch(`/api/dashboard`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${$jwt_cookie}`
                    }
                });
                if (connect.status == 200)
                {
                    console.log("your fetch was sucessfull");
                    goto('/app/dashboard');
                }
                else
                {
                    //connection refusee a cause dun mauvai/vieux/invalid/corrompu cookie
                    console.log("fetch failed in login page");
                    console.log(connect.status);
                }
            }
            catch (error) {
                console.error("fetching in '/' :" , error);
            }
        }
    })
</script>

<div class="wrapper">
    <form>
        <h1>FT_TRANSCENDENCE</h1>
        <h2>Hello traveler, to start you pong journey please use the button bellow</h2>
        <a href={data.url} class="login-button">
            Sign in with 42
        </a>
    </form>
</div>


<style global>

    :global(body) 
    {
        margin: 0 0 0 0;
        padding: 0 0 0 0;
    }

    .wrapper {
        background-image: src('/background42.jpg');
        background-size: cover;
        background-position: center;
        width: 100%;
        height: 100vh;
    }

    form {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        padding: 100px;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    form h1 {
    text-align: center;
    margin-bottom: 20px;
}
    form h2 {
    text-align: center;
    margin-bottom: 20px;
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
        margin: auto auto;
    }

    .login-button:hover {
        background-color: #0062cc;
    }
</style>
