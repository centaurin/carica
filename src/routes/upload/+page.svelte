<script lang="ts">
	import { enhance } from "$app/forms";
	import { clsx } from "$lib/clsx";
	import { allowedFileTypes } from "$lib/constants";
	import Dropzone from "svelte-file-dropzone";

	const { form } = $props();

	let filesAccepted = $state<File[]>([]);

	const contentErrors = $derived(form?.validationErrors?.content);

	const handleFilesSelect = (e: CustomEvent<{ acceptedFiles: File[] }>) => {
		const { acceptedFiles } = e.detail;
		filesAccepted.push(...acceptedFiles);
	};
</script>

<div class="relative flex w-full grow items-center justify-center">
	<enhanced:img
		src="$images/apple.jpg"
		class="absolute top-1/5 left-1/10 -z-10 w-40 rotate-20 border-10 border-white shadow-2xl md:top-1/4 md:left-1/6"
		alt=""
	/>
	<enhanced:img
		src="$images/banana.jpg"
		class="absolute top-2/3 left-1/5 -z-10 w-36 -rotate-10 border-9 border-white shadow-2xl"
		alt=""
	/>
	<enhanced:img
		src="$images/guava.jpeg"
		class="absolute top-1/8 right-1/10 -z-10 w-52 -rotate-10 border-12 border-white shadow-2xl md:top-1/5 md:right-1/7"
		alt=""
	/>
	<enhanced:img
		src="$images/pomegranate.jpg"
		class="absolute top-2/3 right-1/5 -z-10 w-44 -rotate-30 border-11 border-white shadow-2xl md:right-1/4"
		alt=""
	/>
	<form
		method="POST"
		action="?/push"
		enctype="multipart/form-data"
		class="bg-body-light/80 dark:bg-body-dark/80 flex w-[90dvw] max-w-[500px] flex-col gap-3 p-8"
		use:enhance
	>
		<h1 class="text-2xl font-bold">Upload</h1>
		<span class="italic">All of these pictures should be of one fruit at a time.</span>
		<Dropzone
			accept={allowedFileTypes}
			multiple
			containerClasses="!bg-nav-light !border-divide-light !text-black dark:!text-white dark:!bg-nav-dark dark:!border-divide-dark"
			name="file"
			required
			aria-invalid={!!contentErrors}
			aria-describedby={!!contentErrors ? "file-error-label" : undefined}
			on:drop={handleFilesSelect}
		/>
		{#if contentErrors}
			<div id="file-error-label" class="flex flex-col gap-2">
				{#each contentErrors as error}
					<p class="text-error-light dark:text-error-dark">{error}</p>
				{/each}
			</div>
		{/if}
		<ol class="flex flex-row flex-wrap gap-2">
			{#each filesAccepted as file}
				{@const url = URL.createObjectURL(file)}
				<li
					class="border-divide-light dark:border-divide-dark dark:bg-nav-dark bg-nav-light flex flex-row gap-2 rounded-full border p-1"
				>
					<img
						class="h-6 w-6 rounded-full object-cover"
						src={url}
						alt={file.name}
						title={file.name}
						width="24"
						height="24"
					/>
					<p class="line-clamp-1 max-w-32 pr-1">{file.name}</p>
				</li>
			{/each}
		</ol>
		<button
			class={clsx(
				"block w-fit rounded-md bg-black px-4 py-2 text-white transition-colors hover:bg-neutral-800",
				"dark:bg-white dark:text-black dark:hover:bg-neutral-200"
			)}
			type="submit"
		>
			Submit
		</button>
	</form>
</div>
