ALTER TABLE "Character" ALTER COLUMN "phonetics" SET DATA TYPE varchar(32);--> statement-breakpoint
ALTER TABLE "Character" ALTER COLUMN "phonetics" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "Character" drop column "phonetics";--> statement-breakpoint
ALTER TABLE "Character" ADD COLUMN "phonetics" varchar(32) GENERATED ALWAYS AS (metaphone("Character"."name", 32)) STORED;