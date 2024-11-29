import { eq } from "drizzle-orm";
import { db } from "./db";
import { users } from "./db/schema";
import { takeUniqueOrThrow } from "./utils";

export const createUser = async (
	githubId: number,
	email: string,
	username: string
): Promise<User> => {
	const row = await db
		.insert(users)
		.values({ githubId, email, username })
		.returning({ id: users.id })
		.then(takeUniqueOrThrow);
	if (row === null) {
		throw new Error("Unexpected error");
	}
	const user: User = {
		id: row.id,
		githubId,
		email,
		username
	};
	return user;
};

export const getUserFromGitHubId = async (githubId: number): Promise<User | null> => {
	const row = await db
		.select({
			id: users.id,
			githubId: users.githubId,
			email: users.email,
			username: users.username
		})
		.from(users)
		.where(eq(users.githubId, githubId))
		.then(takeUniqueOrThrow);
	if (row === null) {
		return null;
	}
	const user: User = {
		id: row.id,
		githubId: row.githubId,
		email: row.email,
		username: row.username
	};
	return user;
};

export interface User {
	id: number;
	email: string;
	githubId: number;
	username: string;
}
