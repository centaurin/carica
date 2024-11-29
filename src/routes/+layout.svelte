<script lang="ts">
	import "../app.css";
	import { dev } from "$app/environment";
	import { getSerwist } from "virtual:serwist";
	import { isColorScheme } from "$lib/utils";
	import { colorScheme } from "$lib/stores/colorScheme";
	import SvgBarrel from "$components/icons/index.svelte";
	import Navbar from "$components/layouts/Navbar.svelte";

	let { children } = $props();

	let navbarHeight = $state(65);

	$effect(() => {
		const registerSerwist = async () => {
			if (!dev && "serviceWorker" in navigator) {
				const serwist = await getSerwist();
				serwist?.addEventListener("installed", () => {
					console.log("Serwist installed!");
				});
				void serwist?.register();
			}
		};
		registerSerwist();
	});

	$effect(() => {
		const newTheme = document.documentElement.dataset.theme;
		$colorScheme = isColorScheme(newTheme) ? newTheme : "light";
		colorScheme.subscribe((value) => {
			document.documentElement.dataset.theme = value;
			localStorage.setItem("theme", value);
		});
	});
</script>

<SvgBarrel />
<div
	class="divide-divide-light dark:divide-divide-dark flex h-full w-full flex-col md:flex-row md:divide-x"
>
	<Navbar bind:height={navbarHeight} />
	<main class="flex-1 w-full h-full md:contents pb-(--nav-height)" style="--nav-height:{navbarHeight}px">
		{@render children()}
	</main>
</div>
