<script>
    // @ts-nocheck

    import Loading from "$lib/components/Loading.svelte";
    export let flag;
</script>

{#if !flag}
    <button type="submit" form="chatMessage"><i class="bi bi-send" /></button>
{:else}
    <Loading />
{/if}

<style>
    button {
        height: 2.5rem;
        border-radius: 0;
    }

    button:hover {
        transform: translatey(3px);
        box-shadow: none;
        animation: ani9 0.4s ease-in-out infinite alternate;
    }
</style>
