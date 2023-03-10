<div class="Loading">
    <span class="loader" />
</div>

<style>
    .loader {
        width: 8px;
        height: 8px;
        padding: 4px;
        border: 5px dotted #02020294;
        border-radius: 50%;
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        animation: rotation 2s linear infinite;
    }

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .Loading {
        background-color: #f5df4ddd;
        border: 1px solid rgba(66, 66, 66, 0.114);
        text-align: right;
        padding: 8px;
        margin-left: 3px;
        border-radius: 3px;
    }
</style>
