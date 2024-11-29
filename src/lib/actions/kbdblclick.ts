import type { ActionReturn } from "svelte/action";

type KeyboardEventHandler = (e: KeyboardEvent) => void;

export type DblclickEvent<T extends HTMLElement = HTMLElement> = KeyboardEvent & {
	currentTarget: EventTarget & T;
};

export type DblclickHandler<T extends HTMLElement = HTMLElement> = (ev: DblclickEvent<T>) => void;

/**
 * A Svelte action that handles keyboard interactions for `ondblclick`.
 * @param element
 * @param fn
 * @returns
 */
export const kbdblclick = <T extends HTMLElement = HTMLElement>(
	element: T,
	handler: DblclickHandler<T>
): ActionReturn<DblclickHandler<T>> => {
	let fn = handler;
	const keyboardFn = ((event: KeyboardEvent & { currentTarget: EventTarget & T }) => {
		event.stopPropagation();
		if (event.code === "Enter" || event.code === "Space") {
			fn(event);
		}
	}) as KeyboardEventHandler;
	element.addEventListener("keydown", keyboardFn);
	return {
		update(parameter) {
			fn = parameter;
		},
		destroy() {
			element.removeEventListener("keydown", keyboardFn);
		},
	};
};
