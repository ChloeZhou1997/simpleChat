<script>
    import { enhance } from "$app/forms";
    import { applyAction, deserialize } from "$app/forms";
    import { invalidateAll } from "$app/navigation";

    async function resetList(event) {
        const data = new FormData(this);
        const response = await fetch(this.action, {
            method: "POST",
            body: data,
        });

        /** @type {import('@sveltejs/kit').ActionResult} */
        const result = deserialize(await response.text());

        if (result.type === "success") {
            // re-run all `load` functions, following the successful update
            await invalidateAll();
        }

        applyAction(result);
    }

    let showMoreOptions = false;
</script>

<div class="show-more-options">
    {#if showMoreOptions}
        <div class="options">
            <div class="opt">
                <form method="POST" action="?/logout" use:enhance>
                    <button id="btna2">Log out</button>
                </form>
            </div>
            <div class="opt">
                <form
                    method="POST"
                    on:submit|preventDefault={resetList}
                    action="?/resetList"
                    id="clearHistory"
                >
                    <button class="clearHistory">Clear history</button>
                </form>
            </div>
        </div>
    {/if}
    <div
        class="selector"
        on:click={() => (showMoreOptions = !showMoreOptions)}
        on:keypress={() => (showMoreOptions = !showMoreOptions)}
    >
        <div class="ico">
            <i class="bi bi-list" />
        </div>
    </div>
</div>

<!-- <div class="DropDown">
    <ul class="list">
        <li class="nav-item">
            <ul class="dropdown">
                <li class="dropdown-item">

                </li>
                <li class="dropdown-item">

                </li>
            </ul>
        </li>
    </ul>
</div> -->
<style>
    .show-more-options {
        position: relative;
        display: block;
    }

    .options {
        position: absolute;
        left: -1.5em;
        bottom: 2.8em;
        width: 120px;
    }
    .ico {
        font-size: 20px;
        color: black;
    }

    button {
        width: 100%;
        background-color: #f5df4d35;
        border-radius: 0px;
    }

    button:hover {
        background-color: rgba(255, 166, 0, 0.451);
    }

    .selector {
        padding: 0.6em;
        width: 2.5rem;
        background-color: rgba(211, 211, 211, 0.415);
        height: 2.5rem;
    }

    .selector:hover {
        background-color: rgba(128, 128, 128, 0.368);
    }
</style>
