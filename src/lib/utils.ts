import { COLOR_SCHEMES } from "./constants";
import type { ColorScheme } from "./types";

/**
 * Checks if value is of type `ColorScheme`.
 *
 * @param value
 * @returns
 */
export const isColorScheme = (value?: string): value is ColorScheme =>
	typeof value === "string" && COLOR_SCHEMES.includes(value as ColorScheme);
