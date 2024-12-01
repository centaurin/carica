import { fail, redirect } from "@sveltejs/kit";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/session";

export const actions = {
	logout(event) {
		if (event.locals.session === null) {
			return fail(401);
		}
		invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);
		redirect(302, "/login");
	},
};
