import { writable } from "svelte/store";
import type { ColorScheme } from "$lib/types";

export const colorScheme = writable<ColorScheme>("light");

export const setColorScheme = (value?: ColorScheme) => {
	colorScheme.update((oldValue) => (value || oldValue === "dark" ? "light" : "dark"));
};
