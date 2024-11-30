import { GitHub } from "arctic";
import { env } from "$env/dynamic/private";
import { building } from "$app/environment";

export let github: GitHub;

if (!building) {
	if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
		throw new Error("GitHub OAuth variables are not set.");
	}
	github = new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, null);
}
