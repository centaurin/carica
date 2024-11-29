<script lang="ts">
	import "../app.css";
	import { dev } from "$app/environment";
	import { getSerwist } from "virtual:serwist";
	import { isColorScheme } from "$lib/utils";
	import { colorScheme } from "$lib/stores/colorScheme";
	import { onNavigate } from "$app/navigation";

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

	let { children } = $props();
</script>

{@render children()}
