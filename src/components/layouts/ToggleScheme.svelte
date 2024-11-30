<script lang="ts">
	import Image from "$components/Image.svelte";
	import { setColorScheme } from "$lib/stores/colorScheme";
</script>

<button class="nav-button flex-shrink-0" onclick={() => setColorScheme()}>
	<span class="visible-dark size-6 *:-mt-px">
		<Image systemImage="moon.zzz.fill" />
	</span>
	<span class="visible-light size-6">
		<Image systemImage="sun.max.fill" />
	</span>
	<span class="sr-only">Toggle color scheme</span>
</button>
