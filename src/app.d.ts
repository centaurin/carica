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
		interface PageData {
			user: Pick<User, "id" | "githubId" | "username"> | null;
		}
		interface PageState {
			carilog_lastOpened?: number | undefined;
		}
		// interface Platform {}
	}
}

declare module "svelte/elements" {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface SVGAttributes<_> {
		inert?: boolean;
	}
}

export {};
