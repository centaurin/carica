import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
	githubId: integer("github_id").notNull().unique(),
	email: text("email").notNull().unique(),
	username: text("username").notNull()
});

export const userSessions = pgTable("user_sessions", {
	id: text("id").notNull().primaryKey(),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	expiresAt: timestamp("expires_at").notNull()
});
