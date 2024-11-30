<script lang="ts">
	let container = $state<HTMLDivElement | null>(null);
	// let canvas = $state<HTMLCanvasElement | null>(null);
</script>

<div class="relative h-fit w-full" bind:this={container}>
	<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
	</div>
</div>
