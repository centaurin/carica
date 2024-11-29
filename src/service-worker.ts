/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { defaultCache } from "vite-plugin-serwist/worker";
import {
	type PrecacheEntry,
	Serwist,
	CacheFirst,
	ExpirationPlugin,
	CacheableResponsePlugin,
	RangeRequestsPlugin,
} from "serwist";

declare global {
	interface WorkerGlobalScope {
		__SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
	}
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
	precacheEntries: self.__SW_MANIFEST,
	precacheOptions: {
		cleanupOutdatedCaches: true,
		concurrency: 25,
		ignoreURLParametersMatching: [/^x-sveltekit-invalidated$/],
	},
	skipWaiting: true,
	navigationPreload: false,
	clientsClaim: true,
	runtimeCaching: [
		{
			matcher({ request }) {
				return request.destination === "video";
			},
			handler: new CacheFirst({
				cacheName: "static-video-assets",
				plugins: [
					new ExpirationPlugin({
						maxEntries: 16,
						maxAgeSeconds: 30 * 24 * 60 * 60, // ~30 days
						maxAgeFrom: "last-used",
					}),
					new CacheableResponsePlugin({
						statuses: [200],
					}),
					new RangeRequestsPlugin(),
				],
			}),
		},
		...defaultCache,
	],
});

serwist.addEventListeners();
