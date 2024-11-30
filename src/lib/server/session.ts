import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import type { RequestEvent } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { users, userSessions } from "./db/schema";
import type { User } from "./user";
import { takeUniqueOrThrow } from "./utils";

export const generateSessionToken = () => {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
};

export const createSession = async (token: string, userId: number): Promise<Session> => {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
	};
	await db
		.insert(userSessions)
		.values({ id: session.id, userId: session.userId, expiresAt: session.expiresAt });
	return session;
};

export const validateSessionToken = async (token: string): Promise<SessionValidationResult> => {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const row = await db
		.select({
			id: userSessions.id,
			userId: users.id,
			githubId: users.githubId,
			email: users.email,
			username: users.username,
			expiresAt: userSessions.expiresAt,
		})
		.from(userSessions)
		.innerJoin(users, eq(users.id, userSessions.userId))
		.where(eq(userSessions.id, sessionId))
		.then(takeUniqueOrThrow);
	if (row === null) {
		return { session: null, user: null };
	}
	const session: Session = {
		id: row.id,
		userId: row.userId,
		expiresAt: row.expiresAt,
	};
	const user: User = {
		id: row.userId,
		githubId: row.githubId,
		email: row.email,
		username: row.username,
	};
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(userSessions).where(eq(userSessions.id, session.id));
		return { session: null, user: null };
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await db
			.update(userSessions)
			.set({
				expiresAt: session.expiresAt,
			})
			.where(eq(userSessions.id, session.id));
	}
	return { session, user };
};

export const invalidateSession = async (sessionId: string): Promise<void> => {
	await db.delete(userSessions).where(eq(userSessions.id, sessionId));
};

export const setSessionTokenCookie = (
	event: RequestEvent,
	token: string,
	expiresAt: Date
): void => {
	event.cookies.set("session", token, {
		httpOnly: true,
		path: "/",
		secure: import.meta.env.PROD,
		sameSite: "lax",
		expires: expiresAt,
	});
};

export const deleteSessionTokenCookie = (event: RequestEvent): void => {
	event.cookies.set("session", "", {
		httpOnly: true,
		path: "/",
		secure: import.meta.env.PROD,
		sameSite: "lax",
		maxAge: 0,
	});
};

export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };

export interface Session {
	id: string;
	userId: number;
	expiresAt: Date;
}
