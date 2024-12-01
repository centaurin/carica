CREATE TABLE IF NOT EXISTS "photo" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "photo_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"group_id" integer NOT NULL,
	"file_type" text NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "photos" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "photos_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"quality" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"github_id" integer NOT NULL,
	"email" text NOT NULL,
	"username" text NOT NULL,
	CONSTRAINT "users_github_id_unique" UNIQUE("github_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "photo" ADD CONSTRAINT "photo_group_id_photos_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."photos"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "photos" ADD CONSTRAINT "photos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "photos_user_idx" ON "photos" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "photos_type_idx" ON "photos" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_sessions_user_idx" ON "user_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_github_id_idx" ON "users" USING btree ("github_id");