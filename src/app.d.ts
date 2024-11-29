import type { User } from "$lib/server/user";
import type { Session } from "$lib/server/session";
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
			session: Session | null;
		}
		// interface PageData {}
		interface PageState {
			history_lastOpened?: number | undefined;
		}
		// interface Platform {}
	}
}

export {};
