<script lang="ts">
	import { enhance } from "$app/forms";
	import { page } from "$app/stores";
	import MenuItem from "$components/layouts/MenuItem.svelte";
	import { clsx } from "$lib/clsx";

	let navUsermenu = $state<HTMLDetailsElement | null>(null);

	const user = $derived($page.data.user);

	$effect(() => {
		$page.url.pathname;
		if (navUsermenu) {
			navUsermenu.open = false;
		}
	});
</script>

{#if user}
	<details bind:this={navUsermenu} class="relative inline-block text-left">
		<summary class="nav-button shrink-0" id="navbar-usermenu-button">
			<img
				alt="Your avatar"
				width={24}
				height={24}
				class="h-6 w-6 rounded-full text-transparent"
				src="https://avatars.githubusercontent.com/u/{user.githubId}"
			/>
		</summary>
		<div
			id="navbar-usermenu"
			class={clsx(
				"bg-nav-light dark:bg-nav-dark text-black dark:text-white absolute mt-2 rounded-[10px] shadow-lg transition ease-in-out [&>*]:p-1",
				"border-divide-light dark:border-divide-dark dark:bg-wood-800 bg-wood-300 border-[0.25px]",
				"divide-divide-light dark:divide-divide-dark divide-y ring-1 ring-black/5 focus:outline-none",
				"animate-fly-up right-0 bottom-full z-50 w-52 origin-top-right -translate-y-4"
			)}
			role="menu"
			tabindex={0}
			aria-labelledby="navbar-usermenu-button"
		>
			<div>
				<div
					class="flex flex-row items-center gap-2 p-2"
					id="navbar-usermenu-items"
					role="menuitem"
					tabindex={-1}
				>
					<div>
						<div class="text-base font-bold">
							{user.username}
						</div>
					</div>
				</div>
			</div>
			<div>
				<MenuItem as="button">
					<!-- <UserCircle
						width={20}
						height={20}
						class="mr-2 h-auto w-5"
						aria-hidden="true"
						tabindex={-1}
					/> -->
					Your profile
				</MenuItem>
				<form method="POST" action="/?/logout" use:enhance>
					<MenuItem as="button">
						<!-- <LogOut
							width={20}
							height={20}
							class="mr-2 h-auto w-5"
							aria-hidden="true"
							tabindex={-1}
						/> -->
						Sign out
					</MenuItem>
				</form>
			</div>
		</div>
	</details>
{/if}
