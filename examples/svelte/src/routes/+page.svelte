<script lang="ts">
	import "../../../../dist/ripple.css";
	import { ripple } from "../../../../dist/svelte";

	let disabled = false;
</script>

<h1>Material Ripple Web</h1>
<div class="flex items-center">
	<button class="relative btn">
		<div use:ripple={{ disabled }} />
		<span>Click me</span>
	</button>

	<label for="toggle" class="ml-2 mr-0.25"> Disabled </label>
	<input id="toggle" type="checkbox" bind:checked={disabled} />
</div>

<style>
	:global(body) {
		font-family: system-ui, sans-serif;
		max-width: 480px;
		margin: 0 auto;
	}

	.flex {
		display: flex;
	}

	.items-center {
		align-items: center;
	}

	.relative {
		position: relative;
	}

	.btn {
		appearance: none;
		height: 2.5rem;
		padding: 0 1.5rem;
		border-radius: 9999px;
		border: 1px solid black;
		background-color: transparent;
		font-size: 1rem;
	}

	.ml-2 {
		margin-left: 2rem;
	}

	.mr-0\.25 {
		margin-right: 0.25rem;
	}
</style>
