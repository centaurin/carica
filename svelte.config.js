// @ts-check
import adapter from "@sveltejs/adapter-node";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			$components: "./src/components",
			$images: "./src/images",
		},
		csp: {
			directives: {
				"script-src": [
					"self",
					"strict-dynamic",
					"sha256-FMxfk74dHfBCYzMIZUQ4Knxy7KC296NL8jB9VY5HicY=",
				],
			},
		},
		inlineStyleThreshold: 2048,
		paths: {
			relative: false,
		},
		serviceWorker: {
			register: false,
		},
	},
};

export default config;
