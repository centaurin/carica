import { ObjectParser } from "@pilcrowjs/object-parser";
import type { OAuth2Tokens } from "arctic";
import { generateSessionToken, createSession, setSessionTokenCookie } from "$lib/server/session";
import { github } from "$lib/server/oauth";
import { createUser, getUserFromGitHubId } from "$lib/server/user";
import { GITHUB_API_VERSION } from "$lib/server/constants.js";

export const GET = async (event) => {
	const code = event.url.searchParams.get("code");
	const state = event.url.searchParams.get("state");
	const storedState = event.cookies.get("github_oauth_state") ?? null;
	if (code === null || state === null || storedState === null) {
		return new Response(null, {
			status: 400
		});
	}
	if (state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	let tokens: OAuth2Tokens;
	try {
		tokens = await github.validateAuthorizationCode(code);
	} catch {
		// Invalid code or client credentials
		return new Response(null, {
			status: 400
		});
	}
	const githubAccessToken = tokens.accessToken();
	const githubUserResponse = await event.fetch("https://api.github.com/user", {
		headers: {
			Accept: "application/vnd.github+json",
			Authorization: `Bearer ${githubAccessToken}`,
			"X-GitHub-Api-Version": GITHUB_API_VERSION
		}
	});
	const githubUser = await githubUserResponse.json();
	const githubUserParser = new ObjectParser(githubUser);
	const githubUserId = githubUserParser.getNumber("id");
	const githubUsername = githubUserParser.getString("login");
	const existingUser = await getUserFromGitHubId(githubUserId);
	if (existingUser) {
		const sessionToken = generateSessionToken();
		const session = await createSession(sessionToken, existingUser.id);
		setSessionTokenCookie(event, sessionToken, session.expiresAt);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/"
			}
		});
	}
	const emailListResponse = await event.fetch("https://api.github.com/user/emails", {
		headers: {
			Authorization: `Bearer ${githubAccessToken}`,
			"X-GitHub-Api-Version": GITHUB_API_VERSION
		}
	});
	const emailListResult: unknown = await emailListResponse.json();
	if (!Array.isArray(emailListResult) || emailListResult.length < 1) {
		return new Response("Please restart the process.", {
			status: 400
		});
	}
	let email: string | null = null;
	for (const emailRecord of emailListResult) {
		const emailParser = new ObjectParser(emailRecord);
		const primaryEmail = emailParser.getBoolean("primary");
		const verifiedEmail = emailParser.getBoolean("verified");
		if (primaryEmail && verifiedEmail) {
			email = emailParser.getString("email");
		}
	}
	if (email === null) {
		return new Response("Please verify your GitHub email address.", {
			status: 400
		});
	}
	const user = await createUser(githubUserId, email, githubUsername);
	const sessionToken = generateSessionToken();
	const session = await createSession(sessionToken, user.id);
	setSessionTokenCookie(event, sessionToken, session.expiresAt);
	return new Response(null, {
		status: 302,
		headers: {
			Location: "/"
		}
	});
};
