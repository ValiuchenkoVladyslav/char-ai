import vercelAdapter from "@sveltejs/adapter-vercel";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import("@sveltejs/kit").Config} */
export default {
	preprocess: vitePreprocess(),

	kit: {
		files: {
			assets: "src/static",
		},

		adapter: vercelAdapter({
			runtime: "edge",
			regions: ["fra1"],
		}),
	},
};
