CREATE TABLE `Character` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(32) NOT NULL,
	`description` text(256),
	`masterPrompt` text(512) NOT NULL,
	`image` text(255) NOT NULL,
	`pfp` text(255) NOT NULL,
	`likesCount` integer DEFAULT 0 NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer NOT NULL,
	`creatorId` integer,
	FOREIGN KEY (`creatorId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `Like` (
	`characterId` integer NOT NULL,
	`userId` integer NOT NULL,
	PRIMARY KEY(`characterId`, `userId`),
	FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `User` (
	`id` integer PRIMARY KEY NOT NULL,
	`displayName` text(32) NOT NULL,
	`username` text(24) NOT NULL,
	`pfp` text(255),
	`email` text(32),
	`passwordHash` text(255),
	`googleId` text(255),
	`registerMethod` integer NOT NULL,
	`banned` integer DEFAULT false NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `User_username_unique` ON `User` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `User_email_unique` ON `User` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `User_googleId_unique` ON `User` (`googleId`);