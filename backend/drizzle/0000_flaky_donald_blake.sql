CREATE TABLE "Character" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(32) NOT NULL,
	"phonetics" varchar(32) GENERATED ALWAYS AS (metaphone("Character"."name", 32)) STORED NOT NULL,
	"description" varchar(256) NOT NULL,
	"pfpUrl" varchar NOT NULL,
	"coverImageUrl" varchar NOT NULL,
	"prompt" varchar(512) NOT NULL,
	"likesCount" integer DEFAULT 0 NOT NULL,
	"creatorId" integer
);
--> statement-breakpoint
CREATE TABLE "Like" (
	"characterId" integer NOT NULL,
	"userId" integer NOT NULL,
	CONSTRAINT "Like_characterId_userId_pk" PRIMARY KEY("characterId","userId")
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag" varchar(24) NOT NULL,
	"name" varchar(32) NOT NULL,
	"pfp" varchar,
	"email" varchar(32) NOT NULL,
	"passwordHash" varchar,
	"googleId" varchar,
	"authMethod" smallint NOT NULL,
	CONSTRAINT "User_tag_unique" UNIQUE("tag"),
	CONSTRAINT "User_email_unique" UNIQUE("email"),
	CONSTRAINT "User_googleId_unique" UNIQUE("googleId")
);
--> statement-breakpoint
ALTER TABLE "Character" ADD CONSTRAINT "Character_creatorId_User_id_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Like" ADD CONSTRAINT "Like_characterId_Character_id_fk" FOREIGN KEY ("characterId") REFERENCES "public"."Character"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;