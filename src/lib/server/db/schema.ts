import { index, integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const users = pgTable(
	"users",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		githubId: integer("github_id").notNull().unique(),
		email: text("email").notNull().unique(),
		username: text("username").notNull(),
	},
	(table) => [uniqueIndex("users_github_id_idx").on(table.githubId)]
);

export const userSessions = pgTable(
	"user_sessions",
	{
		id: text("id").notNull().primaryKey(),
		userId: integer("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		expiresAt: timestamp("expires_at").notNull(),
	},
	(table) => [index("user_sessions_user_idx").on(table.userId)]
);

export const photos = pgTable(
	"photos",
	{
		id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
		userId: integer("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text("type").notNull(),
		quality: text("quality").notNull(),
	},
	(table) => [index("photos_user_idx").on(table.userId), index("photos_type_idx").on(table.type)]
);

export const photo = pgTable("photo", {
	id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
	groupId: integer("group_id")
		.notNull()
		.references(() => photos.id, { onDelete: "cascade" }),
	fileType: text("file_type").notNull(),
	content: text("content").notNull(),
});
