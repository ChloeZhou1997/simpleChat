<script>
  // @ts-nocheck
  import { onMount } from "svelte";
  import { invalidateAll, goto } from "$app/navigation";
  import { applyAction, deserialize } from "$app/forms";
  import { enhance } from "$app/forms";

  /** @type {import('./$types').PageData} */
  export let data;
  export let form;

  let inputArea;
  let messageForm;
  let flag = false;
  let clearHistoryForm;

  onMount(() => {
    window.scrollTo(0, document.body.scrollHeight);

    // window.addEventListener("beforeunload", function (e) {
    //   clearHistoryForm.requestSubmit();
    // });
  });

  $: if (inputArea) {
    inputArea.focus();
    window.scrollTo(0, document.body.scrollHeight);
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

  async function deleteList(event) {
    console.log("click");
    const response = await fetch(resetList, {
      method: "POST",
    });
  }

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
</script>

<svelte:head>
  <title>Chatbot</title>
  <meta name="description" content="Chatbot powered by GPT" />
</svelte:head>

{#if !data.user}
  <div class="fixMiddle">
    <form
      class="loginForm"
      method="POST"
      action="?/login"
      id="loginform"
      use:enhance
    >
      <div class="con">
        <input
          class="form-input"
          name="username"
          type="text"
          placeholder="Username"
        />
        <input
          class="form-input"
          name="password"
          type="password"
          placeholder="Password"
        />
      </div>
      <div class="con">
        <button class="logbutton">Log in</button>
        <button class="logbutton register" formaction="?/register"
          >Register</button
        >
      </div>
    </form>
  </div>
{/if}

{#if data.user}
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
      <div class="formFooter">
        <form method="POST" action="?/logout" use:enhance>
          <button>Logout</button>
        </form>
        <form
          method="POST"
          on:submit|preventDefault={resetList}
          action="?/resetList"
          id="clearHistory"
          bind:this={clearHistoryForm}
        >
          <button class="clearHistory">clear history</button>
        </form>
        {#if !flag}
          <button type="submit" form="chatMessage">submit</button>
        {:else}
          <div class="Loading"><p>loading...</p></div>
        {/if}
      </div>
    </div>
  </section>
{/if}

<style>
  h1 {
    padding: 1em;
    font-size: 2em;
    text-align: center;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }

  section {
    max-width: 900px;
    margin: 0 auto;
    display: grid;
    grid-template-rows: 1fr min-content;
    height: 100vh;
  }

  p {
    margin: 0;
    padding: 0;
  }

  .fixMiddle {
    position: fixed;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }

  .loginForm {
    max-width: 450px;
    border-radius: 5px;
    background-image: linear-gradient(-225deg, #fcdf87 50%, #bbbbbbaa 50%);
    box-shadow: 0 9px 50px hsla(20, 67%, 75%, 0.31);
    padding: 2%;
    height: auto;
  }

  .con {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    margin: 0 auto;
    padding: 20px;
  }

  .logbutton {
    display: inline-block;
    color: #252537;

    width: 150px;
    height: 50px;

    background: #fff;
    border-radius: 5px;

    outline: none;
    border: none;

    cursor: pointer;
    text-align: center;
    margin: 2px;
    transition: all 0.2s linear;

    letter-spacing: 0.1em;
  }

  /* buttons hover */
  button:hover {
    transform: translatey(3px);
    box-shadow: none;
  }

  /* buttons hover Animation */
  button:hover {
    animation: ani9 0.4s ease-in-out infinite alternate;
  }

  .register {
    background: #fcdf87;
  }

  .form-input {
    width: 240px;
    height: 50px;

    margin-top: 2%;
    padding: 15px;

    font-size: 16px;
    outline: none;
    border: none;

    border-radius: 0px 5px 5px 0px;
    transition: 0.2s linear;
  }
  .chatBox {
    padding: 1em;
    background-color: #b2b3b4;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
  }

  .messageBox {
    overflow-y: auto;
  }

  .msg {
    font-size: 18px;
    font-family: Helvetica, sans-serif;
    padding: 1em;
    margin: 1em;
    border-radius: 20px;
    max-width: fit-content;
  }

  .chatBubbleAssistant {
    background-color: #d4d5d7;
  }

  .chatBubbleUser {
    background-color: #f5df4d;
    text-align: right;
    margin-left: auto;
  }

  .formFooter {
    display: flex;
    justify-content: flex-end;
  }

  button {
    background-color: #f5df4ddd;
    border: 1px solid rgba(255, 255, 255, 0.407);
    margin-left: 4px;
    border-radius: 5px;
    width: 80px;
    padding: 10px 10px;
  }

  .clearHistory {
    width: 120px;
    background-color: rgba(255, 255, 251, 0.454);
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
    border-radius: 15px;
  }

  .Loading {
    text-align: right;
    width: 80px;
    padding: 10px 10px;
    margin-left: 4px;
  }
</style>
