CREATE TABLE "Character" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(32) NOT NULL,
	"description" varchar(256),
	"masterPrompt" varchar(512) NOT NULL,
	"image" varchar(255) NOT NULL,
	"pfp" varchar(255) NOT NULL,
	"likesCount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
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
	"displayName" varchar(32) NOT NULL,
	"username" varchar(16) NOT NULL,
	"pfp" varchar(255),
	"email" varchar(32),
	"passwordHash" varchar(255),
	"googleId" varchar(255),
	"registerMethod" integer NOT NULL,
	"banned" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "User_username_unique" UNIQUE("username"),
	CONSTRAINT "User_email_unique" UNIQUE("email"),
	CONSTRAINT "User_googleId_unique" UNIQUE("googleId")
);
--> statement-breakpoint
ALTER TABLE "Character" ADD CONSTRAINT "Character_creatorId_User_id_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Like" ADD CONSTRAINT "Like_characterId_Character_id_fk" FOREIGN KEY ("characterId") REFERENCES "public"."Character"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;