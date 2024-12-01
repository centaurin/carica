<script lang="ts">
	import { enhance } from "$app/forms";
</script>

<div
	class="bg-nav-light dark:bg-nav-dark flex min-h-0 w-full min-w-0 shrink-0 grow-1 basis-0 flex-col"
>
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
			<span class="text-shadow-lg block text-6xl font-bold relative">
				<enhanced:img src="$images/favicon.png" class="h-auto w-8 absolute -top-2 -left-2 -z-10" alt="" />
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

	<form method="POST" action="?/push" enctype="multipart/form-data" use:enhance>
		<input type="file" name="file" multiple />
		<button type="submit">submit</button>
	</form>
</div>
