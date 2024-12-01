import { db } from "$lib/server/db/index.js";
import { photo, photos } from "$lib/server/db/schema.js";
import { jsonAggBuildObject } from "$lib/server/utils.js";
import { redirect } from "@sveltejs/kit";
import { desc, eq } from "drizzle-orm";

export const load = async (event) => {
	if (!event.locals.user || !event.locals.session) {
		redirect(302, "/login");
	}
	const data = await db
		.select({
			id: photos.id,
			type: photos.type,
			quality: photos.quality,
			createdAt: photos.createdAt,
			photos: jsonAggBuildObject({
				fileType: photo.id,
				content: photo.content,
			}),
		})
		.from(photos)
		.leftJoin(photo, eq(photo.groupId, photos.id))
		.groupBy(photos.id, photos.type)
		.where(eq(photos.userId, event.locals.user.id))
		.orderBy(desc(photos.id));
	return {
		data,
	};
};
