<script lang="ts">
    import { hostname } from "../../hostname"

    const url = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-a5af938705ebd0c4b5b8a782f8b8026fb20fae93ce976a067e4d2033ee47c4d9&redirect_uri=http%3A%2F%2F${hostname}%3A3000%2Fauth&response_type=code`
</script>

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

<form>
    <a href={url} class="login-button">
    <!-- <a href="https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-a5af938705ebd0c4b5b8a782f8b8026fb20fae93ce976a067e4d2033ee47c4d9&redirect_uri=http%3A%2F%2Fc1r5p2%3A3000%2Fauth&response_type=code" class="login-button"> -->
        Sign in with 42
    </a>
</form>