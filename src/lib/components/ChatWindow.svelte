<script>
    // @ts-nocheck

    import { afterUpdate } from "svelte";

    export let messages;
    let messageBox;

    afterUpdate(() => {
        messageBox.scrollTo(0, messageBox.scrollHeight);
    });
</script>

<div class="messageBox" bind:this={messageBox}>
    {#each messages as post}
        {#if post.role == "assistant"}
            <div class="msg chatBubbleAssistant">
                <p>{post.content}</p>
            </div>
        {:else}
            <div class="msg chatBubbleUser">
                <p>{post.content}</p>
            </div>
        {/if}
    {/each}
</div>

<style>
    .messageBox {
        overflow-y: auto;
    }

    .msg {
        font-size: 18px;
        font-family: Helvetica, sans-serif;
        padding: 1rem;
        margin: 1rem;
        border-radius: 5px;
        max-width: fit-content;
        box-shadow: 3px 3px 3px rgba(141, 141, 141, 0.333);
    }

    .msg p {
        padding: 0;
        margin: 0;
    }

    .chatBubbleAssistant {
        background-color: #d4d5d7;
    }

    .chatBubbleUser {
        background-color: #f5df4d;
        text-align: right;
        margin-left: auto;
    }
</style>
