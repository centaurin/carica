<script lang="ts">
	import { page } from "$app/stores";
	import { clsx } from "$lib/clsx";
	import { isLinkActive } from "$lib/utils";
	import NavLink from "./NavLink.svelte";
	import NavToggleScheme from "./NavToggleScheme.svelte";

	interface NavLinkEntry {
		label: string;
		link: string;
	}

	let { height = $bindable(0) }: { height?: number } = $props();

	let mobileMenu = $state<HTMLDetailsElement | undefined>(undefined);

	const links = $derived(
		(
			[
				{ label: "home", link: "/" },
				...($page.data.user
					? [{ label: "history", link: "/history" }]
					: [{ label: "login", link: "/login" }])
			] satisfies NavLinkEntry[]
		).map(({ link, ...rest }) => ({
			link,
			...rest,
			isActive: isLinkActive(link, $page.url.pathname)
		}))
	);

	$effect(() => {
		$page.url.pathname;
		if (mobileMenu) {
			mobileMenu.open = false;
		}
	});
</script>

<header
	bind:offsetHeight={height}
	class={clsx(
		"fixed bottom-0 z-50 max-h-dvh w-full transition-all duration-150 md:sticky md:top-0 md:h-dvh md:w-64 xl:w-80 print:hidden",
		"bg-nav-light/80 dark:bg-nav-dark/80 flex flex-col p-2 md:shrink-0 md:self-start md:px-4"
	)}
>
	<nav
		class="flex h-fit w-full items-center gap-1 transition-colors duration-100 md:flex-col md:items-start"
	>
		<div class="flex items-center gap-2 md:block md:items-start md:py-2">
			<a
				class="flex shrink-0 flex-wrap items-center gap-2 px-3 py-2 font-mono select-none"
				href="/"
				aria-label="Go to home"
			>
				<enhanced:img src="$images/favicon.png" class="h-auto w-6" alt="" />
				<span class="-mb-1">Carica</span>
			</a>
		</div>
		<div
			class="w-fit min-w-0 grow basis-0 overflow-x-auto pr-2 md:order-last md:w-full md:flex-1 md:pr-0"
		>
			<ul
				class="ml-auto flex w-max items-center gap-1 md:max-h-[50dvh] md:w-full md:grow md:flex-col md:items-start md:overflow-y-auto"
			>
				{#each links as { label, link, isActive }}
					<li class="w-max md:w-full">
						<NavLink href={link} textCenter={false} {isActive}>
							{label}
						</NavLink>
					</li>
				{/each}
			</ul>
		</div>
		<div class="flex flex-row-reverse items-center gap-1 md:flex-row">
			<NavToggleScheme />
		</div>
	</nav>
</header>
