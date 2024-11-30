import { fail, redirect } from "@sveltejs/kit";
import { z } from "zod";
import { deleteSessionTokenCookie, invalidateSession } from "$lib/server/session";
import { takeUniqueOrThrow } from "$lib/server/utils.js";
import { db } from "$lib/server/db/index.js";
import { photo, photos } from "$lib/server/db/schema.js";
import { MODEL_URL } from "$env/static/private";

export async function load(event) {
	if (event.locals.session === null || event.locals.user === null) {
		return redirect(302, "/login");
	}
}

const allowedFileTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];

const photoSchema = z
	.instanceof(File, { message: "Not a valid photo!" })
	.refine((file) => allowedFileTypes.includes(file.type), { message: "Not a valid photo!" });

const pushFormSchema = z.object({
	content: z.array(photoSchema).min(1, { message: "No photo selected!" }),
});

export const actions = {
	async push(event) {
		if (!event.locals.user || !event.locals.session) return;
		const formData = await event.request.formData();
		const form = await pushFormSchema.spa({
			content: formData.getAll("file"),
		});
		if (!form.success) {
			return fail(400, { validationErrors: form.error.flatten().fieldErrors });
		}
		const modelResponse = await event.fetch(`${MODEL_URL}/api`, {
			method: "POST",
			body: formData,
			headers: {
				Accept: "application/json",
			},
		});
		if (!modelResponse.ok) {
			return fail(modelResponse.status, { error: "Failed to assess photos." });
		}
		const modelAssessment = (await modelResponse.json()) as { type: string; quality: string };
		const id = await db.transaction(async (tx) => {
			if (!event.locals.user || !event.locals.session) {
				throw new Error("Unexpected error");
			}
			const row = await db
				.insert(photos)
				.values({
					userId: event.locals.user.id,
					type: modelAssessment.type,
					quality: modelAssessment.quality,
				})
				.returning({ id: photos.id })
				.then(takeUniqueOrThrow);
			if (row === null) {
				tx.rollback();
			}
			const insertValues = await Promise.all(
				form.data.content.map(async (file) => {
					return {
						groupId: row!.id,
						fileType: file.type,
						content: Buffer.from(await file.arrayBuffer()).toString("base64"),
					} satisfies typeof photo.$inferInsert;
				})
			);
			const photosInserted = await tx
				.insert(photo)
				.values(insertValues)
				.returning({ id: photo.id });
			if (photosInserted.length === 0) {
				tx.rollback();
			}
			return row!.id;
		});
		redirect(307, `/carilog?id=${id}`);
	},
	logout(event) {
		if (event.locals.session === null) {
			return fail(401);
		}
		invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);
		redirect(302, "/login");
	},
};
