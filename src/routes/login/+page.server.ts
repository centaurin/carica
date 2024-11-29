import { redirect } from "@sveltejs/kit";

export const load = async (event) => {
	if (event.locals.session !== null && event.locals.user !== null) {
		return redirect(302, "/");
	}
	return {};
};
