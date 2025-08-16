CREATE TABLE "Character" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Character_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(32) NOT NULL,
	"phonetics" varchar(32) GENERATED ALWAYS AS (metaphone("Character"."name", 32)) STORED NOT NULL,
	"description" varchar(256) NOT NULL,
	"pfpUrl" varchar NOT NULL,
	"coverImageUrl" varchar NOT NULL,
	"prompt" varchar(512) NOT NULL,
	"creatorId" integer
);
--> statement-breakpoint
CREATE TABLE "Like" (
	"characterId" integer,
	"userId" integer,
	CONSTRAINT "Like_characterId_userId_pk" PRIMARY KEY("characterId","userId")
);
--> statement-breakpoint
CREATE TABLE "Session" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "Session_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"tokenHash" varchar NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"userId" integer
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "User_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"tag" varchar(24) NOT NULL,
	"name" varchar(32) NOT NULL,
	"pfpUrl" varchar,
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
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "phoneticsIdx" ON "Character" USING btree ("phonetics");--> statement-breakpoint
CREATE INDEX "characterIdIdx" ON "Like" USING btree ("characterId");--> statement-breakpoint
CREATE INDEX "userIdIdx" ON "Like" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "tokenHashIdx" ON "Session" USING btree ("tokenHash");--> statement-breakpoint
CREATE UNIQUE INDEX "userTagIdx" ON "User" USING btree ("tag");