<script>
    // @ts-nocheck
    import { afterUpdate } from "svelte";
    import { applyAction, deserialize } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    export let flag;
    export let messages;
    let messageForm;
    let inputArea;

    afterUpdate(() => {
        inputArea.focus();
    });

    function appendMessage() {
        messages.push({ role: "user", content: inputArea.value });
        messages = messages;
    }

    async function keyHandler(event) {
        switch (event.key) {
            case "Enter":
                event.preventDefault();
                messageForm.requestSubmit();
        }
    }

    async function handleSubmit(event) {
        if (!isMessageValid() || flag) {
            return;
        }

        appendMessage();

        messages.push({ role: "assistant", content: ". . ." });
        messages = messages;

        flag = true;
        const data = new FormData(this);
        inputArea.value = "";
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
        flag = false;
    }

    $: if (inputArea) {
        inputArea.focus();
        window.scrollTo(0, document.body.scrollHeight);
    }

    function isMessageValid() {
        if (inputArea.value === "") {
            return false;
        } else if (!/\S/.test(inputArea.value)) {
            return false;
        }
        return true;
    }
</script>

<form
    method="POST"
    id="chatMessage"
    bind:this={messageForm}
    on:submit|preventDefault={handleSubmit}
    action="?/createPost"
>
    <!-- <input name="body" type="text" /> -->
    <textarea
        placeholder="start your chat here..."
        name="body"
        form="chatMessage"
        class="textArea"
        on:keydown={keyHandler}
        bind:this={inputArea}
    />
</form>

<style>
    .textArea {
        font-size: 1rem;
        line-height: 1rem;
        min-height: 1rem;
        width: 100%;
        text-align: left;
        padding: 1rem;
        resize: none;
        border: none;
        outline: none;
    }
</style>
