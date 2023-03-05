<script>
  // @ts-nocheck
  import { enhance } from "$app/forms";
  import { onMount } from "svelte";
  import { Button, Col, Row } from "sveltestrap";
  /** @type {import('./$types').PageData} */
  export let data;

  let inputArea;
  let form;

  onMount(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  $: if (inputArea) {
    inputArea.focus();
    window.scrollTo(0, document.body.scrollHeight);
  }

  function keyHandler(event) {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        form.submit();
    }
  }
</script>

<svelte:head>
  <title>Chatbot</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  <div class="messageBox">
    <h1>Powered by GPT</h1>
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
      action="?/createPost"
      id="chatMessage"
      bind:this={form}
      use:enhance
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
        <button>submit</button>
      </div>
    </form>
  </div>
</section>

<style>
  h1 {
    padding: 1em;
    font-size: 2em;
    text-align: center;
  }
  form {
    background-color: lightgrey;
    padding: 1em;
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
  .chatBox {
    padding: 1em 1em 0 1em;
  }

  .msg {
    font-size: 18px;
    font-family: Helvetica, sans-serif;
    padding: 1em;
    margin: 1em;
    width: fit-content;
    border-radius: 8px;
  }

  .chatBubbleAssistant {
    border: 2px solid grey;
    background-color: lightblue;
  }

  .chatBubbleUser {
    border: 2px solid yellow;
    background-color: lightgoldenrodyellow;
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
    width: 10%;
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
</style>
