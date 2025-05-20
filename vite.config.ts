import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
	return {
		plugins: [tailwindcss(), sveltekit()],

		esbuild: {
			dropLabels: [mode === "development" ? "PROD" : "DEV"],
		},
	};
});
