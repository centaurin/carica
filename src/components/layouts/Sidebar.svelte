<script lang="ts">
	import { page } from "$app/stores";
	import { isLinkActive } from "$lib/utils";
	import { clsx } from "$lib/clsx";
	import ToggleScheme from "./ToggleScheme.svelte";
	import Menu from "./Menu.svelte";

	interface SidebarLinkEntry {
		label: string;
		link: string;
	}

	let sidebar = $state<HTMLElement>(null!);

	const links = $derived(
		(
			[
				{ label: "Home", link: "/" },
				...($page.data.user
					? [{ label: "Carilog", link: "/carilog" }]
					: [{ label: "Login", link: "/login" }]),
			] satisfies SidebarLinkEntry[]
		).map(({ link, ...rest }) => ({
			link,
			...rest,
			isActive: isLinkActive(link, $page.url.pathname),
		}))
	);

	$effect(() => {
		$page.url.pathname;
		sidebar?.hidePopover();
	});
</script>

<svelte:window
	onresize={() => {
		sidebar?.hidePopover();
	}}
/>

<aside
	bind:this={sidebar}
	id="nav"
	class={clsx(
		"bg-nav-light dark:bg-nav-dark top-[unset] bottom-0 left-0 z-[321032] h-[85dvh] w-dvw rounded-t-2xl px-8 transition-[transform,translate,width]",
		"transition-discrete duration-400 backdrop:bg-black/40 md:sticky md:flex md:h-dvh md:w-64 md:shrink-0 md:flex-col md:rounded-none md:py-8 lg:w-80"
	)}
	popover="auto"
>
	<button
		popovertarget="nav"
		popovertargetaction="hide"
		class="relative h-11 w-full cursor-pointer md:hidden"
	>
		<span class="absolute left-1/2 h-1 w-1/5 -translate-x-1/2 rounded-md bg-gray-400">
			<span class="sr-only">Close drawer</span>
		</span>
	</button>
	<nav>
		<a
			class="mb-6 flex shrink-0 flex-wrap items-center gap-2 font-mono select-none"
			href="/"
			aria-label="Go to home"
		>
			<enhanced:img src="$images/favicon.png" class="h-auto w-6" alt="" />
			<span class="-mb-1">Carica</span>
		</a>
		<ul class="flex flex-col gap-2">
			{#each links as { label, link, isActive }}
				<li class="text-lg font-semibold">
					<a
						class={clsx(
							"transition-colors duration-150",
							isActive
								? "text-black dark:text-white"
								: "text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
						)}
						href={link}
						aria-current={isActive}
					>
						{label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
	<div class="absolute bottom-0 left-0 flex w-full flex-row-reverse gap-2 p-2">
		<Menu />
		<ToggleScheme />
	</div>
</aside>
