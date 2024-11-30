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

/**
 * Checks whether the current link is active.
 *
 * @param link
 * @param pathname
 * @returns
 */
export const isLinkActive = (link: string, pathname: string) => {
	if (pathname === "/") {
		return link === "/";
	}
	const pathnameFirstSegment = pathname.slice(0, pathname.indexOf("/", 1));
	return !!pathnameFirstSegment && link.startsWith(pathnameFirstSegment);
};

export const groupBy = <K extends PropertyKey, T>(
	items: T[],
	callback: (item: T, index: number) => K
): Partial<Record<K, T[]>> => {
	return items.reduce(
		(acc = {}, item, index) => {
			const key = callback(item, index);
			acc[key] ??= [];
			acc[key].push(item);
			return acc;
		},
		{} as Partial<Record<K, T[]>>
	);
};
