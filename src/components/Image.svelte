<script lang="ts">
	import Svg from "./icons/Svg.svelte";

	interface ImageProps {
		systemImage: string;
	}

	const { systemImage }: ImageProps = $props();
</script>

<Svg
	fill="currentColor"
	stroke="currentColor"
	width="100%"
	height="100%"
	aria-hidden="true"
	tabindex={-1}
	inert
>
	<use href="#{systemImage}" />
</Svg>
