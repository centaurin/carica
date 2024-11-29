<script lang="ts">
	import type { EmblaCarouselType } from "embla-carousel";
	import emblaCarousel from "embla-carousel-svelte";
	import { tick } from "svelte";
	import { pushState } from "$app/navigation";
	import { page } from "$app/stores";
	import Image from "$components/Image.svelte";
	import { kbdblclick } from "$lib/actions/kbdblclick";
	import { clsx } from "$lib/clsx";

	const { data } = $props();

	let lastFocused = $state<number | undefined>(undefined);
	let currentViewed = $state<number | undefined>(undefined);
	let emblaApi = $state<EmblaCarouselType | null>(null);
	const photos = $derived(data.data);
	const lastOpened = $derived($page.state.history_lastOpened);

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
				history_lastOpened: openTarget
			});
		} else {
			document.startViewTransition(async () => {
				if (currentViewed) lastFocused = currentViewed;
				pushState("", {
					history_lastOpened: openTarget
				});
				await tick();
			});
		}
	};
</script>

<svelte:window onkeydown={handleArrowKeys} />

<div
	class={clsx(
		"relative h-full w-full",
		lastOpened === undefined && "flex flex-row-reverse flex-wrap-reverse gap-0.5 overflow-auto p-10"
	)}
>
	{#if lastOpened !== undefined}
		{#if currentViewed !== undefined && currentViewed < photos.length - 1}
			<div
				class="group absolute top-1/2 left-0 z-10 flex h-4/5 -translate-y-1/2 items-center px-12"
			>
				<button
					class={clsx(
						"size-8 cursor-default rounded-sm py-1.5 pr-1 pl-0.5 transition-opacity duration-150 active:brightness-75",
						"text-[#3b3b3b]/80 opacity-0 group-hover:bg-white/60 group-hover:opacity-100"
					)}
					onclick={() => emblaApi?.scrollNext()}
				>
					<Image systemImage="chevron.backward" />
					<span class="sr-only">See next photo</span>
				</button>
			</div>
		{/if}
		{#if currentViewed !== undefined && currentViewed > 0}
			<div
				class="group absolute top-1/2 right-0 z-10 flex h-4/5 -translate-y-1/2 items-center px-12"
			>
				<button
					class={clsx(
						"size-8 cursor-default rounded-sm py-1.5 pr-0.5 pl-1 transition-opacity duration-150 active:brightness-75",
						"text-[#3b3b3b]/80 opacity-0 group-hover:bg-white/60 group-hover:opacity-100"
					)}
					onclick={() => emblaApi?.scrollPrev()}
				>
					<Image systemImage="chevron.forward" />
					<span class="sr-only">See previous photo</span>
				</button>
			</div>
		{/if}
		<div
			class="relative h-full w-full overflow-hidden"
			use:emblaCarousel={{
				options: {
					align: "start",
					containScroll: false,
					direction: "rtl",
					dragFree: true,
					startIndex: lastOpened,
					watchResize: false
				},
				plugins: []
			}}
			onemblaInit={onEmbiaInit}
		>
			<div class="flex h-full flex-row-reverse">
				{#each photos as photo, idx}
					{@const isCurrentViewed = currentViewed === idx}
					<div class="flex h-full min-w-0 flex-[0_0_100%] items-center justify-center">
						<img
							src={photo.url}
							class="max-h-full max-w-full object-contain select-none"
							style:view-transition-name={isCurrentViewed ? `photo-${idx}` : undefined}
							alt="Carica Papaya (Good quality)"
							width={photo.width}
							height={photo.height}
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
				class="flex aspect-square h-fit w-[calc((100%-0.25rem)/3)] md:w-[calc((100%-0.5rem)/5)] lg:w-[calc((100%-1rem)/9)] items-center justify-center overflow-hidden select-none"
				aria-label="Image"
				onclick={() => (lastFocused = idx)}
				autofocus={lastFocused === idx}
				ondblclick={() => switchOpenTarget(idx)}
				use:kbdblclick={() => switchOpenTarget(idx)}
			>
				<span class="relative h-4/5 w-4/5">
					<img
						src={photo.url}
						class={clsx(
							"absolute top-1/2 left-1/2 mx-auto h-fit max-h-full w-fit max-w-full -translate-x-1/2 -translate-y-1/2 object-contain outline-offset-[1px] select-none",
							lastFocused === idx && "rounded-[0.125rem] outline-3 outline-[#0761d1]"
						)}
						style:view-transition-name="photo-{idx}"
						alt="Carica Papaya (Good quality)"
						width={photo.width}
						height={photo.height}
						decoding="async"
						loading="eager"
					/>
				</span>
			</button>
		{/each}
	{/if}
</div>
