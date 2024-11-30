import { fail, redirect } from "@sveltejs/kit";
import { z } from "zod";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/session";
import { takeUniqueOrThrow } from "$lib/server/utils.js";
import { db } from "$lib/server/db/index.js";
import { photos } from "$lib/server/db/schema.js";

export async function load(event) {
	if (event.locals.session === null || event.locals.user === null) {
		return redirect(302, "/login");
	}
}

const pushForm = z.object({
	content: z.instanceof(File, { message: "Not a valid photo!" })
});

export const actions = {
	async push(event) {
		if (!event.locals.user || !event.locals.session) return;
		const formData = await event.request.formData();
		const form = await pushForm.spa({
			content: formData.get("content")
		});
		if (!form.success) {
			return { validationErrors: form.error.flatten().fieldErrors };
		}
		const content = Buffer.from(await form.data.content.arrayBuffer()).toString("base64");
		const row = await db
			.insert(photos)
			.values({
				userId: event.locals.user.id,
				type: "Banana",
				content,
				description: "A banana is a sus yellow amogus",
				quality: 0.68
			})
			.returning({ id: photos.id })
			.then(takeUniqueOrThrow);
		if (row === null) {
			throw new Error("Unexpected error");
		}
		redirect(307, `/carilog?id=${row.id}`);
	},
	logout(event) {
		if (event.locals.session === null) {
			return fail(401);
		}
		invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);
		redirect(302, "/login");
	}
};
