ALTER TABLE "photos" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;