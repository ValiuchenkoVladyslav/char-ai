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
			runtime: "nodejs20.x",
			regions: ["fra1"],
			isr: {
				expiration: false,
			},
		}),
	},
};
