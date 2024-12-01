<script lang="ts">
	import type { Picture } from "vite-imagetools";

	interface FloatingImageProps {
		normal: Picture;
		detached: Picture;
		title: string;
		description: string;
	}

	const { normal, detached, title, description }: FloatingImageProps = $props();
</script>

<section
	class="group flex h-dvh max-w-full flex-row flex-wrap items-center gap-12 px-20 perspective-[100dvh] transform-3d **:transform-3d odd:flex-row-reverse"
>
	<div
		class="relative aspect-square w-75 transition-transform duration-200"
		style:view-timeline-name="--floating-scroll"
	>
		<div class="absolute inset-0 m-0 w-full overflow-hidden rounded-2xl *:contents">
			<enhanced:img
				src={normal}
				alt=""
				class="animate-scroll absolute top-0 left-1/2 aspect-square w-full -translate-x-1/2 object-cover"
				style:animation-timeline="--floating-scroll"
				style:animation-range="entry 120% cover 80%"
			/>
		</div>
		<div
			class="absolute inset-0 m-0 w-full overflow-visible rounded-2xl *:contents"
			style:clip-path="inset(-200% 0 0 0)"
			aria-hidden="true"
		>
			<enhanced:img
				src={detached}
				alt=""
				class="animate-scroll absolute top-0 left-1/2 aspect-square w-full -translate-x-1/2 object-cover"
				style:animation-timeline="--floating-scroll"
				style:animation-range="entry 120% cover 80%"
			/>
		</div>
	</div>
	<div class="space-y-4 text-black dark:text-white">
		<h2 class="dark:text-shadow-lg relative block text-6xl font-bold group-odd:text-right">
			{title}
		</h2>
		<span class="dark:text-shadow-md ml-1 block text-2xl group-odd:text-right">
			{description}
		</span>
	</div>
</section>
