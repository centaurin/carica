<script lang="ts">
	import "../app.css";
	import { dev } from "$app/environment";
	import { getSerwist } from "virtual:serwist";
	import { isColorScheme } from "$lib/utils";
	import { colorScheme } from "$lib/stores/colorScheme";
	import SvgBarrel from "$components/icons/index.svelte";
	import Sidebar from "$components/layouts/Sidebar.svelte";
	import SidebarTrigger from "$components/layouts/SidebarTrigger.svelte";

	let { children } = $props();

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
	class="divide-divide-light dark:divide-divide-dark flex h-fit min-h-screen w-full flex-col md:flex-row md:divide-x"
>
	<Sidebar />
	<main class="flex h-full w-full flex-1 md:contents">
		<SidebarTrigger />
		{@render children()}
	</main>
</div>
