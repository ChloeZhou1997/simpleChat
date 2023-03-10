<script>
    // @ts-nocheck
    import { invalidateAll } from "$app/navigation";
    import { applyAction, deserialize, enhance } from "$app/forms";
    import Logout from "$lib/components/Logout.svelte";
    import ChatWindow from "$lib/components/ChatWindow.svelte";
    import MessageBox from "$lib/components/MessageBox.svelte";

    import Submit from "$lib/components/Submit.svelte";

    /** @type {import('./$types').PageData} */
    export let data;
    let flag = false;
    let checked = false;

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

    function handleCheckBox(event) {
        checked = !checked;
        setTimeout(() => (event.target.checked = checked), 0);
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
                <div class="checkbox">
                    <label>
                        First time user?
                        <input
                            type="checkbox"
                            {checked}
                            on:click|preventDefault={handleCheckBox}
                        />
                    </label>
                </div>
                {#if !checked}
                    <button class="logbutton">Log in</button>
                {:else}
                    <button class="logbutton register" formaction="?/register"
                        >Register</button
                    >
                {/if}
            </div>
        </form>
    </div>
{/if}

{#if data.user}
    <section>
        <ChatWindow messages={data.message} />
        <div class="chatBox">
            <MessageBox bind:flag bind:messages={data.message} />
            <div class="formFooter">
                <Logout />

                <form
                    method="POST"
                    on:submit|preventDefault={resetList}
                    action="?/resetList"
                    id="clearHistory"
                >
                    <button class="clearHistory">clear history</button>
                </form>
                <Submit {flag} />
            </div>
        </div>
    </section>
{/if}

<style>
    section {
        max-width: 900px;
        margin: 0 auto;
        display: grid;
        grid-template-rows: 1fr min-content;
        height: 100vh;
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
        margin: auto;
        padding: 10px;
    }

    .checkbox {
        width: 200px;
        height: 50px;
        text-align: center;
        margin: 3px;
        padding-top: 15px;
        font-size: 14px;
        font-family: "Courier New", Courier, monospace;
    }

    .logbutton {
        display: inline-block;
        color: #252537;

        width: 140px;
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

    .formFooter {
        display: flex;
        justify-content: flex-end;
    }

    .clearHistory {
        width: 120px;
        background-color: rgba(255, 255, 251, 0.454);
    }
</style>
