<script lang="ts">
	import "../app.css";

  const { children } = $props();
</script>

{#snippet sidebarLink()}
  <a href="/" class="w-56 font-semibold px-3 flex items-center text-lg gap-2 h-12 rounded-lg hover:bg-fg/10">
    Discover
  </a>
{/snippet}

<header class="sticky top-0 h-12 bg-bg flex items-center justify-between">
  <nav class="flex items-center">
    {@render sidebarLink()}

    <section>
      some breadcrumbs
    </section>
  </nav>

  <button class="bg-red-600 h-9 w-9 rounded-full mr-3">
    a
  </button>
</header>

<aside class="sticky top-12 hidden md:flex lg:w-56 float-left flex-col h-[calc(100vh-48px)]">
  <nav class="flex flex-col">
    {@render sidebarLink()}
    {@render sidebarLink()}
    {@render sidebarLink()}
  </nav>
</aside>

<main class="overflow-y-auto h-[calc(100vh-48px)]">
  {@render children()}
</main>
