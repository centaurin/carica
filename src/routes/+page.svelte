<script lang="ts">
	import appleNormal from "$images/apple.jpg?enhanced";
	import appleDetached from "$images/apple-remove-bg.png?enhanced";
	import bananaNormal from "$images/banana.jpg?enhanced";
	import bananaDetached from "$images/banana-remove-bg.png?enhanced";
	import guavaNormal from "$images/guava.jpeg?enhanced";
	import guavaDetached from "$images/guava-remove-bg.png?enhanced";
	import pomegranateNormal from "$images/pomegranate.jpg?enhanced";
	import pomegranateDetached from "$images/pomegranate-remove-bg.png?enhanced";
	import { enhance } from "$app/forms";
	import FloatingImage from "./FloatingImage.svelte";
</script>

<div class="bg-nav-light dark:bg-nav-dark flex h-fit w-full min-w-0 flex-col">
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
		<span class="absolute top-1/2 -translate-y-1/2 space-y-4 px-16 text-white">
			<span class="text-shadow-lg relative block text-6xl font-bold">
				<enhanced:img
					src="$images/favicon.png"
					class="absolute -top-2 -left-2 -z-10 h-auto w-8"
					alt=""
				/>
				Carica
			</span>
			<span class="text-shadow-md ml-1 block text-2xl">
				Upload your fruits and learn more about them with ease.
			</span>
			<a class="mt-8 ml-1 block w-fit rounded-md bg-white px-4 py-2 text-black" href="/upload">
				lock in now!
			</a>
		</span>
	</div>
	<FloatingImage normal={appleNormal} detached={appleDetached} />
	<FloatingImage normal={bananaNormal} detached={bananaDetached} />
	<FloatingImage normal={guavaNormal} detached={guavaDetached} />
	<FloatingImage normal={pomegranateNormal} detached={pomegranateDetached} />
	<form method="POST" action="?/push" enctype="multipart/form-data" use:enhance>
		<input type="file" name="file" multiple />
		<button type="submit">submit</button>
	</form>
</div>
