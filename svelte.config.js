import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import vercelAdapter from "@sveltejs/adapter-vercel";

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
    })
	}
};
