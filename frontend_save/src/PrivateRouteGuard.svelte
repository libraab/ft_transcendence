<script>
    import { useNavigate, useLocation } from "svelte-navigator";
    import { userId42 } from "./stores";

    const navigate = useNavigate();
    const location = useLocation();

    $: if (!$userId42) {
        navigate("/login", {
            state: { from: $location.pathname },
            replace: true,
        });
    }
</script>

{#if $userId42}
    <slot />
{/if}
