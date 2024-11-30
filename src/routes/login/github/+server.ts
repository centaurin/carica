import { generateState } from "arctic";
import { github } from "$lib/server/oauth";

export const GET = async (event) => {
	const state = generateState();
	const url = github.createAuthorizationURL(state, []);
	event.cookies.set("github_oauth_state", state, {
		httpOnly: true,
		path: "/",
		secure: false,
		maxAge: 60 * 10,
		sameSite: "lax",
	});
	return new Response(null, {
		status: 302,
		headers: {
			Location: url.toString(),
		},
	});
};
