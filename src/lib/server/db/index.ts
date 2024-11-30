import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "$env/dynamic/private";
import { building } from "$app/environment";

let client: postgres.Sql;

export let db: ReturnType<typeof drizzle>;

if (!building) {
	if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
	client = postgres(env.DATABASE_URL);
	db = drizzle(client);
}
