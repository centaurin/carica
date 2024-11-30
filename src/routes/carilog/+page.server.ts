import { db } from "$lib/server/db/index.js";
import { photos } from "$lib/server/db/schema.js";
import { redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const load = async (event) => {
	if (!event.locals.user || !event.locals.session) {
		redirect(302, "/login");
	}
	const data = await db
		.select({ id: photos.id, content: photos.content })
		.from(photos)
		.where(eq(photos.userId, event.locals.user.id));
	return {
		data
	};
};
