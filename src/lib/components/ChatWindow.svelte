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
            <div class="messagePadder">
                <div class="msg chatBubbleUser">
                    <p>{post.content}</p>
                </div>
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
        overflow-wrap: break-word;
    }

    .msg p {
        padding: 0;
        margin: 0;
    }

    .messagePadder {
        padding-left: 17px;
    }

    .chatBubbleAssistant {
        background-color: #d4d5d7;
    }

    .chatBubbleUser {
        background-color: #f5df4d;
        margin-left: auto;
    }
</style>
