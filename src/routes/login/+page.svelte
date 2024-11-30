<script>
	import Image from "$components/Image.svelte";
</script>

<div class="flex h-full w-full items-center justify-center">
	<div class="px-4 py-8">
		<div class="grid gap-16 p-8 lg:grid-cols-2">
			<div class="relative mt-8 ml-16 space-y-6">
				<div class="absolute -top-5 -z-10 h-full w-full blur-2xl brightness-75 *:contents">
					<enhanced:img src="$images/fruits.jpg" alt="" class="h-full w-full object-fill" />
				</div>
				<h1 class="mb-4 text-4xl font-bold text-neutral-900 dark:text-neutral-100">
					Ready to make a fruits collection?
				</h1>
				<p class="mb-6 text-lg">Upload your fruits and learn more about them with ease.</p>
			</div>
			<div class="space-y-6">
				<h2 class="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
					<s>lock in</s> login!
				</h2>
				<div class="space-y-4">
					<a
						class="flex w-full flex-row items-center gap-3 rounded-lg bg-black px-4 py-3 text-white"
						href="/login/github"
					>
						<span class="block size-6">
							<Image systemImage="github" />
						</span>
						Sign in with GitHub
					</a>
					<span class="block w-full rounded-lg bg-white px-4 py-3 text-black brightness-60 pointer-events-none select-none">
						Sign in with Google
          </span>
				</div>
			</div>
		</div>
	</div>
</div>
