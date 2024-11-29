import { fail, redirect } from "@sveltejs/kit";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/session";

export async function load(event) {
	if (event.locals.session === null || event.locals.user === null) {
		return redirect(302, "/login");
	}
	return {
		user: event.locals.user
	};
}

export const actions = {
	logout(event) {
		if (event.locals.session === null) {
			return fail(401);
		}
		invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);
		return redirect(302, "/login");
	}
};
