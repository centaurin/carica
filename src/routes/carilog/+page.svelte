<script lang="ts">
	import type { EmblaCarouselType } from "embla-carousel";
	import emblaCarousel from "embla-carousel-svelte";
	import { tick } from "svelte";
	import { pushState } from "$app/navigation";
	import { page } from "$app/stores";
	import Image from "$components/Image.svelte";
	import { kbdblclick } from "$lib/actions/kbdblclick";
	import { clsx } from "$lib/clsx";
	import { groupBy } from "$lib/utils.js";

	const { data } = $props();

	let selectedCategory = $state<string | null>(null);
	let lastFocused = $state<number | undefined>(undefined);
	let currentViewed = $state<number | undefined>(undefined);
	let emblaApi = $state<EmblaCarouselType | null>(null);
	const lastOpened = $derived($page.state.carilog_lastOpened);
	const groups = $derived(groupBy(data.data, (photo) => photo.type));
	const categories = $derived(Object.keys(groups));
	const selectedCategoryIndex = $derived(
		selectedCategory ? categories.indexOf(selectedCategory) : -1
	);
	const photos = $derived(
		selectedCategory && selectedCategory in groups ? groups[selectedCategory]! : data.data
	);

	$effect(() => void (currentViewed = lastOpened));

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
		if (!document.startViewTransition) {
			if (currentViewed) lastFocused = currentViewed;
			pushState("", {
				carilog_lastOpened: openTarget,
			});
		} else {
			document.startViewTransition(async () => {
				if (currentViewed) lastFocused = currentViewed;
				pushState("", {
					carilog_lastOpened: openTarget,
				});
				await tick();
			});
		}
	};
</script>

<svelte:window onkeydown={handleArrowKeys} />

<div class="flex min-h-0 w-full min-w-0 shrink-0 grow-1 basis-0 flex-col">
	<div class="isolate z-100">
		<div
			class={clsx(
				"bg-nav-light dark:bg-nav-dark flex w-full flex-row items-center backdrop-blur-xl transition-[padding] duration-300 select-none",
				"border-b-divide-light dark:border-b-divide-dark h-[3.25rem] border-b px-4 text-neutral-700 dark:text-white"
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
			<h3 class="w-fit px-2 font-semibold" style:view-transition-name="carilog-title">Papaya</h3>
		</div>
		{#if lastOpened === undefined}
			<div class="relative z-10 -mt-px h-fit w-full py-2 overflow-x-auto">
				<div class="pointer-events-none absolute top-0 left-0 -z-1 h-full w-full">
					<div
						class={clsx(
							"bg-nav-light dark:bg-nav-dark border-divide-light dark:border-divide-dark absolute right-2 left-0 h-full w-[250px]",
							"translate-x-[calc(var(--idx)*250px)] border border-t-0 transition-transform",
							selectedCategory === null ? "rounded-br-[12px] border-l-0" : "border rounded-b-[12px]"
						)}
						style:--idx={selectedCategoryIndex + 1}
					>
						<div class="indicator-part left-0 -translate-x-full"></div>
						<div class="indicator-part right-0 translate-x-full -scale-x-100"></div>
					</div>
				</div>
				<div class="flex list-none flex-row w-max" role="tablist" aria-orientation="horizontal">
					<button
						role="tab"
						class="flex w-[250px] cursor-pointer items-center justify-center select-none"
						aria-controls="carilog-tab"
						aria-selected={selectedCategory === null}
						onclick={() => (selectedCategory = null)}
					>
						All
					</button>
					{#each categories as category}
						<button
							role="tab"
							id="carilog-category-{category}-button"
							class="flex w-[250px] cursor-pointer items-center justify-center select-none"
							aria-controls="carilog-tab"
							aria-selected={selectedCategory === category}
							onclick={() => (selectedCategory = category)}
						>
							{category}
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>
	<div
		role="tabpanel"
		id="carilog-tab"
		class={clsx(
			"relative min-h-0 w-full min-w-0 shrink-0 grow-1 basis-0",
			lastOpened === undefined && "flex flex-row flex-wrap gap-0.5 overflow-auto p-10"
		)}
		aria-labelledby={categories.map((category) => `carilog-category-${category}-button`).join(",")}
	>
		{#if lastOpened !== undefined}
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
			{#if currentViewed !== undefined && currentViewed < photos.length - 1}
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
						startIndex: lastOpened,
						watchResize: false,
					},
					plugins: [],
				}}
				onemblaInit={onEmbiaInit}
			>
				<div class="flex h-full flex-row">
					{#each photos as photo, idx}
						{@const isCurrentViewed = currentViewed === idx}
						<div class="flex h-full min-w-0 flex-[0_0_100%] items-center justify-center">
							<img
								src="data:{photo.fileType};base64,{photo.content}"
								class="max-h-full max-w-full object-contain select-none"
								style:view-transition-name={isCurrentViewed ? `photo-${idx}` : undefined}
								alt="Carica Papaya (Good quality)"
								decoding="async"
								loading="lazy"
							/>
						</div>
					{/each}
				</div>
			</div>
		{:else}
			{#each photos as photo, idx}
				<!-- svelte-ignore a11y_autofocus -->
				<button
					class="flex aspect-square h-fit w-[calc((100%-0.25rem)/3)] items-center justify-center overflow-hidden select-none md:w-[calc((100%-0.5rem)/5)] lg:w-[calc((100%-1rem)/9)]"
					aria-label="Image"
					onclick={() => (lastFocused = idx)}
					autofocus={lastFocused === idx}
					ondblclick={() => switchOpenTarget(idx)}
					use:kbdblclick={() => switchOpenTarget(idx)}
				>
					<span class="relative h-4/5 w-4/5">
						<img
							src="data:{photo.fileType};base64,{photo.content}"
							class={clsx(
								"absolute top-1/2 left-1/2 mx-auto h-fit max-h-full w-fit max-w-full -translate-x-1/2 -translate-y-1/2 object-contain outline-offset-[1px] select-none",
								lastFocused === idx && "rounded-[0.125rem] outline-3 outline-[#0761d1]"
							)}
							style:view-transition-name="photo-{idx}"
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
