<script lang="ts">
	import "../app.css";

  import { dev } from "$app/environment";

  import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
  import { injectAnalytics } from "@vercel/analytics/sveltekit";

  injectSpeedInsights();
  injectAnalytics({ mode: dev ? "development" : "production" });

	const { children } = $props();
</script>

{@render children()}
