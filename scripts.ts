// helper scripts

import { execSync, spawn } from "node:child_process";
import { readFileSync } from "node:fs";

const command = process.argv.at(2);

if (command === "key") {
	// generate private or public key & prepare it for env file
	// requires openssl

	const option = process.argv.at(3);

	if (option === "--private") {
		execSync(
			"openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048",
		);

		const privateKey = readFileSync("./private.pem", "utf-8");

		console.log("Generated private key:");
		console.log(privateKey);

		console.log("\nPrepared key for env file:");
		console.log(privateKey.replace(/\r?\n/g, "\\n"));
	} else if (option === "--public") {
		execSync("openssl rsa -in private.pem -pubout -out public.pem");

		const publicKey = readFileSync("./public.pem", "utf-8");

		console.log("Generated public key:");
		console.log(publicKey);

		console.log("\nPrepared key for env file:");
		console.log(publicKey.replace(/\r?\n/g, "\\n"));
	} else {
		console.error("Please provide an option: '--private' or '--public'.");
		process.exit(1);
	}
} else if (command === "dev") {
	// run vite dev server in parallel with drizzle studio

	const studio = spawn("bun", [
		"drizzle-kit",
		"studio",
		"--config",
		"drizzle.config.ts",
	]);
	studio.stdout.on("data", (data) => console.log(data.toString()));
	studio.stderr.on("data", (data) => console.error(data.toString()));

	const vite = spawn("bun", ["vite", "dev"]);
	vite.stdout.on("data", (data) => console.log(data.toString()));
	vite.stderr.on("data", (data) => console.error(data.toString()));
} else {
	console.error("Invalid command. Use 'key' or 'dev'.");
	process.exit(1);
}
