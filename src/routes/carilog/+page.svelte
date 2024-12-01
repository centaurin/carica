<script lang="ts">
	import type { EmblaCarouselType } from "embla-carousel";
	import emblaCarousel from "embla-carousel-svelte";
	import { tick } from "svelte";
	import { goto, pushState } from "$app/navigation";
	import { page } from "$app/stores";
	import Image from "$components/Image.svelte";
	import { kbdblclick } from "$lib/actions/kbdblclick";
	import { clsx } from "$lib/clsx";
	import { groupBy } from "$lib/utils.js";
	import DateTime from "$components/DateTime.svelte";

	const { data } = $props();

	let selectedCategory = $state<string | null>(null);
	let lastFocused = $state<number | undefined>(undefined);
	let currentViewed = $state<number | undefined>(undefined);
	let emblaApi = $state<EmblaCarouselType | null>(null);
	const lastOpened = $derived.by(() => {
		if ($page.state.carilog_lastOpened) {
			return $page.state.carilog_lastOpened;
		}
		const id = $page.url.searchParams.has("id")
			? Number.parseInt($page.url.searchParams.get("id")!)
			: null;
		if (id !== null && !Number.isNaN(id)) {
			return id;
		}
		return undefined;
	});
	const groups = $derived(groupBy(data.data, (entry) => entry.type));
	const categories = $derived(Object.keys(groups));
	const selectedCategoryIndex = $derived(
		selectedCategory ? categories.indexOf(selectedCategory) : -1
	);
	const entries = $derived(
		selectedCategory && selectedCategory in groups ? groups[selectedCategory]! : data.data
	);
	const openedEntry = $derived(
		lastOpened !== undefined ? entries.find((entry) => entry.id === lastOpened) : undefined
	);
	const focusedEntry = $derived(
		lastFocused !== undefined ? entries.find((entry) => entry.id === lastFocused) : undefined
	);
	const bgColors = $derived.by<[string, string]>(() => {
		switch (selectedCategory) {
			case "Apple":
				return ["#fef2f2", "#450a0a"];
			case "Banana":
				return ["#fefce8", "#422006"];
			case "Guava":
				return ["#ecfdf5", "#022c22"];
			case "Lime":
				return ["#f7fee7", "#1a2e05"];
			case "Orange":
				return ["#fff7ed", "#431407"];
			case "Pomegranate":
				return ["#fff1f2", "#4c0519"];
			default:
				return ["#ffffff", "#1e1e1e"];
		}
	});

	$effect(() => {
		if (!emblaApi) return;

		const observer = new ResizeObserver(() => {
			emblaApi?.reInit();
		});

		observer.observe(emblaApi.rootNode());

		return () => observer.disconnect();
	});

	const onEmbiaInit = (event: CustomEvent<EmblaCarouselType>) => {
		emblaApi = event.detail;
		currentViewed = emblaApi.selectedScrollSnap();
		emblaApi.on("select", (ev) => {
			currentViewed = ev.selectedScrollSnap();
			lastFocused = currentViewed;
		});
		emblaApi.on("pointerUp", (emblaApi) => {
			const { scrollTo, target, location } = emblaApi.internalEngine();
			const diffToTarget = target.get() - location.get();
			scrollTo.distance(diffToTarget * 0.1, true);
		});
	};

	const handleArrowKeys = (event: KeyboardEvent) => {
		if (currentViewed === undefined) return;
		if (event.code === "ArrowLeft") {
			emblaApi?.scrollNext();
		}
		if (event.code === "ArrowRight") {
			emblaApi?.scrollPrev();
		}
	};

	const switchOpenTarget = (openTarget: number | undefined) => {
		const update = async () => {
			lastFocused = lastOpened;
			const url = new URL($page.url);
			url.searchParams.delete("id");
			goto(url);
			pushState("", {
				carilog_lastOpened: openTarget,
			});
			await tick();
			currentViewed = openTarget === undefined ? undefined : 0;
		};
		if (!document.startViewTransition) {
			update();
		} else {
			document.startViewTransition(update);
		}
	};

	const changeCategory = (category: string | null) => {
		lastFocused = undefined;
		selectedCategory = category;
	};
</script>

<svelte:window onkeydown={handleArrowKeys} />

<div
	class="bg-nav-light dark:bg-nav-dark flex min-h-0 w-full min-w-0 shrink-0 grow-1 basis-0 flex-col"
>
	<div
		class={clsx(
			"flex w-full flex-row items-center backdrop-blur-xl transition-[padding] duration-300 select-none",
			"h-[3.25rem] px-4 text-neutral-700 dark:text-white"
		)}
	>
		{#if lastOpened !== undefined}
			<button
				class={clsx(
					"h-[1.75rem] w-[1.75rem] rounded-sm px-1 py-1.5 text-neutral-400 transition-colors dark:text-[#9e9e9d]",
					"hover:bg-neutral-300 dark:hover:bg-neutral-700"
				)}
				onclick={() => switchOpenTarget(undefined)}
			>
				<Image systemImage="chevron.backward" />
				<span class="sr-only">Return</span>
			</button>
		{/if}
		<h3 class="w-fit px-2 font-semibold" style:view-transition-name="carilog-title">
			{#if openedEntry}
				{openedEntry.type} ({openedEntry.quality} quality) •<DateTime date={openedEntry.createdAt} />
			{:else if focusedEntry}
				{focusedEntry.type} ({focusedEntry.quality} quality) • <DateTime date={focusedEntry.createdAt} />
			{:else if selectedCategory !== null}
				{selectedCategory}
			{:else}
				Carilog
			{/if}
		</h3>
	</div>
	{#if lastOpened === undefined}
		<div class="relative z-10 -mb-px h-fit w-full overflow-x-auto py-2">
			<div class="pointer-events-none absolute bottom-0 left-0 -z-1 h-full w-full">
				<div
					class={clsx(
						"border-divide-light dark:border-divide-dark absolute right-2 left-0 h-full w-[150px] bg-(--bg-light) lg:w-[250px] dark:bg-(--bg-dark)",
						"translate-x-[calc(var(--idx)*150px)] border border-b-0 transition-[translate,background-color] duration-150 lg:translate-x-[calc(var(--idx)*250px)]",
						selectedCategory === null ? "rounded-tr-[12px] border-l-0" : "rounded-t-[12px] border"
					)}
					style:--idx={selectedCategoryIndex + 1}
					style:--bg-light={bgColors[0]}
					style:--bg-dark={bgColors[1]}
				>
					<div class="indicator-part right-full -scale-x-100"></div>
					<div class="indicator-part left-full"></div>
				</div>
			</div>
			<div class="flex w-max list-none flex-row" role="tablist" aria-orientation="horizontal">
				<button
					role="tab"
					class="flex w-[150px] cursor-pointer items-center justify-center select-none lg:w-[250px]"
					aria-controls="carilog-tab"
					aria-selected={selectedCategory === null}
					onclick={() => changeCategory(null)}
				>
					All
				</button>
				{#each categories as category}
					<button
						role="tab"
						id="carilog-category-{category}-button"
						class="flex w-[150px] cursor-pointer items-center justify-center select-none lg:w-[250px]"
						aria-controls="carilog-tab"
						aria-selected={selectedCategory === category}
						onclick={() => changeCategory(category)}
					>
						{category}
					</button>
				{/each}
			</div>
		</div>
	{/if}
	<div
		role="tabpanel"
		id="carilog-tab"
		class={clsx(
			"border-t-divide-light dark:border-t-divide-dark relative min-h-0 w-full min-w-0 shrink-0 grow-1 basis-0 border-t",
			"bg-(--bg-light) transition-colors duration-150 dark:bg-(--bg-dark)",
			lastOpened === undefined && "flex flex-row flex-wrap gap-0.5 overflow-auto p-10"
		)}
		style:--bg-light={bgColors[0]}
		style:--bg-dark={bgColors[1]}
		aria-labelledby={categories.map((category) => `carilog-category-${category}-button`).join(",")}
	>
		{#if openedEntry}
			{#if currentViewed !== undefined && currentViewed > 0}
				<div
					class="group absolute top-1/2 left-0 z-10 flex h-4/5 -translate-y-1/2 items-center px-12"
				>
					<button
						class={clsx(
							"size-8 cursor-default rounded-sm py-1.5 pr-1 pl-0.5 transition-opacity duration-150 active:brightness-75",
							"text-[#3b3b3b]/80 opacity-0 group-hover:bg-white/60 group-hover:opacity-100"
						)}
						onclick={() => emblaApi?.scrollPrev()}
					>
						<Image systemImage="chevron.backward" />
						<span class="sr-only">See previous photo</span>
					</button>
				</div>
			{/if}
			{#if currentViewed !== undefined && currentViewed < openedEntry.photos.length - 1}
				<div
					class="group absolute top-1/2 right-0 z-10 flex h-4/5 -translate-y-1/2 items-center px-12"
				>
					<button
						class={clsx(
							"size-8 cursor-default rounded-sm py-1.5 pr-0.5 pl-1 transition-opacity duration-150 active:brightness-75",
							"text-[#3b3b3b]/80 opacity-0 group-hover:bg-white/60 group-hover:opacity-100"
						)}
						onclick={() => emblaApi?.scrollNext()}
					>
						<Image systemImage="chevron.forward" />
						<span class="sr-only">See next photo</span>
					</button>
				</div>
			{/if}
			<div
				class="relative h-full w-full overflow-hidden"
				use:emblaCarousel={{
					options: {
						align: "start",
						containScroll: false,
						dragFree: true,
						watchResize: false,
					},
					plugins: [],
				}}
				onemblaInit={onEmbiaInit}
			>
				<div class="flex h-full flex-row">
					{#each openedEntry.photos as photo, idx}
						{@const isCurrentViewed = currentViewed === idx}
						<div class="flex h-full min-w-0 flex-[0_0_100%] items-center justify-center">
							<img
								src="data:{photo.fileType};base64,{photo.content}"
								class="max-h-full max-w-full object-contain select-none"
								style:view-transition-name={isCurrentViewed ? `photo-${openedEntry.id}` : undefined}
								alt="Carica Papaya (Good quality)"
								decoding="async"
								loading="lazy"
							/>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			{#each entries as entry (entry.id)}
				<!-- svelte-ignore a11y_autofocus -->
				<button
					class="flex aspect-square h-fit w-[calc((100%-0.25rem)/3)] items-center justify-center overflow-hidden select-none md:w-[calc((100%-0.5rem)/5)] lg:w-[calc((100%-1rem)/9)]"
					aria-label="Image"
					onclick={() => (lastFocused = entry.id)}
					autofocus={lastFocused === entry.id}
					ondblclick={() => switchOpenTarget(entry.id)}
					use:kbdblclick={() => switchOpenTarget(entry.id)}
				>
					<span class="relative h-4/5 w-4/5">
						<img
							src="data:{entry.photos[0].fileType};base64,{entry.photos[0].content}"
							class={clsx(
								"absolute top-1/2 left-1/2 mx-auto h-fit max-h-full w-fit max-w-full -translate-x-1/2 -translate-y-1/2 object-contain outline-offset-[1px] select-none",
								lastFocused === entry.id && "rounded-[0.125rem] outline-3 outline-[#0761d1]"
							)}
							style:view-transition-name="photo-{entry.id}"
							alt="Carica Papaya (Good quality)"
							decoding="async"
							loading="eager"
						/>
					</span>
				</button>
			{/each}
		{/if}
	</div>
</div>
