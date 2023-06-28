<script>
    import { hostname } from "../../hostname"

    const url = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-5f3017b6c9c5313f82e40ad0ba0c8d67624aa36701a58f08c855f4439334c62d&redirect_uri=http%3A%2F%2F${hostname}%3A3000%2Fauth&response_type=code`
</script>

<form>
    <a href={url} class="login-button">
        Sign in with 42
    </a>
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
