<script>
  // @ts-nocheck
  import { enhance } from "$app/forms";
  import { onMount } from "svelte";
  import { invalidateAll, goto } from "$app/navigation";
  import { applyAction, deserialize } from "$app/forms";
  /** @type {import('./$types').PageData} */
  export let data;

  let inputArea;
  let form;
  let flag = false;

  onMount(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  $: if (inputArea) {
    inputArea.focus();
    window.scrollTo(0, document.body.scrollHeight);
  }

  async function keyHandler(event) {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        form.requestSubmit();
    }
  }

  async function handleSubmit(event) {
    if (!isMessageValid() || flag) {
      return;
    }

    flag = true;
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

    inputArea.value = "";
    inputArea.focus();
    flag = false;
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

<svelte:head>
  <title>Chatbot</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  <div class="messageBox">
    <h1>simplyChat</h1>
    {#each data.message as post}
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
  <div class="chatBox">
    <form
      method="POST"
      id="chatMessage"
      bind:this={form}
      on:submit|preventDefault={handleSubmit}
      action="?/createPost"
    >
      <!-- <input name="body" type="text" /> -->
      <textarea
        name="body"
        form="chatMessage"
        class="textArea"
        on:keydown={keyHandler}
        bind:this={inputArea}
      />
      <div class="formFooter">
        {#if !flag}
          <button>submit</button>
        {:else}
          <div class="Loading"><p>loading...</p></div>
        {/if}
      </div>
    </form>
  </div>
</section>

<style>
  h1 {
    padding: 1em;
    font-size: 2em;
    text-align: center;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }

  section {
    width: 70%;
    margin: 0 auto;
    display: grid;
    grid-template-rows: 1fr min-content;
    height: 100vh;
  }

  input {
    height: 150px;
    width: 700px;
    border-radius: 4px;
    background-color: #f8f8f8;
    border: 2px solid #ccc;
  }

  p {
    margin: 0;
    padding: 0;
  }
  .chatBox {
    padding: 1em;
    background-color: lightgrey;
  }

  .msg {
    font-size: 18px;
    font-family: Helvetica, sans-serif;
    padding: 1em;
    margin: 1em;
    width: 50%;
    border-radius: 8px;
    position: relative;
  }

  .chatBubbleAssistant {
    background-color: lightgrey;
  }

  .chatBubbleUser {
    background-color: lightblue;
    text-align: right;
    margin-left: auto;
  }

  .formFooter {
    display: flex;
    margin-left: auto;
  }

  button {
    background-color: #3cbc8d;
    color: white;
    border-radius: 3px;
    width: 80px;
    padding: 10px 10px;
    margin-left: auto;
  }

  .textArea {
    font-size: 1rem;
    line-height: 2rem;
    min-height: 9.2rem;
    background-color: white;
    text-align: left;
    padding: 0.5rem;
    resize: none;
    width: 100%;
  }

  .Loading {
    margin-left: auto;
    text-align: right;
  }
</style>
