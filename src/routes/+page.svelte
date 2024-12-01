<script lang="ts">
	import appleNormal from "$images/apple.jpg?enhanced";
	import appleDetached from "$images/apple-remove-bg.png?enhanced";
	import bananaNormal from "$images/banana.jpg?enhanced";
	import bananaDetached from "$images/banana-remove-bg.png?enhanced";
	import guavaNormal from "$images/guava.jpeg?enhanced";
	import guavaDetached from "$images/guava-remove-bg.png?enhanced";
	import pomegranateNormal from "$images/pomegranate.jpg?enhanced";
	import pomegranateDetached from "$images/pomegranate-remove-bg.png?enhanced";
	import FloatingImage from "./FloatingImage.svelte";

	const { data } = $props();
</script>

<section class="flex h-fit w-full min-w-0 flex-col bg-lime-100 dark:bg-lime-950">
	<div class="relative h-4/5 w-full">
		<img
			src="/hero.gif"
			class="h-full w-full object-cover"
			alt=""
			width={1920}
			height={1080}
			fetchpriority="high"
			loading="eager"
		/>
		<div class="absolute top-1/2 -translate-y-1/2 space-y-4 px-16 text-white">
			<h1 class="text-shadow-lg relative block text-4xl md:text-6xl font-bold">
				<enhanced:img
					src="$images/favicon.png"
					class="absolute -top-2 -left-2 -z-10 h-auto w-8"
					alt=""
				/>
				Carica
			</h1>
			<span class="text-shadow-md ml-1 block text-lg md:text-2xl">
				Upload your fruits and learn more about them with ease.
			</span>
			<a
				class="mt-8 ml-1 block w-fit rounded-md bg-white px-4 py-2 text-black"
				href={data.user ? "/upload" : "/login"}
			>
				{data.user ? "start uploading!" : "lock in now!"}
			</a>
		</div>
	</div>
	<FloatingImage
		normal={appleNormal}
		detached={appleDetached}
		title="build a collection!"
		description="Carica saves all of your previously taken photos of fruits. Delicious!"
	/>
	<FloatingImage
		normal={bananaNormal}
		detached={bananaDetached}
		title="buying fruits?"
		description="Carica uses a homegrown model to detect whether a fruit is still in good condition."
	/>
	<FloatingImage
		normal={guavaNormal}
		detached={guavaDetached}
		title="food consumption!"
		description="By taking photos, you keep a track of how healthy you've been."
	/>
	<FloatingImage
		normal={pomegranateNormal}
		detached={pomegranateDetached}
		title="try now?"
		description="Above all, Carica is a free (demo) project! So... give us a few secs?"
	/>
	<section class="w-full py-20">
		<h2 class="mx-auto w-fit">
			<a
				class="block w-fit rounded-md bg-black px-4 py-2 text-xl text-white dark:bg-white dark:text-black"
				href={data.user ? "/upload" : "/login"}
			>
				Try Carica!
			</a>
		</h2>
	</section>
</section>
