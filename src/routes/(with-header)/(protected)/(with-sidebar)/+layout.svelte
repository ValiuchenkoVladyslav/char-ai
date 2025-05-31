<script lang="ts">
  const { children, data } = $props();
</script>

{#snippet sidebarLink(href: string, text: string)}
  <a {href} class="px-3 flex items-center text-lg gap-2 h-10 rounded-lg hover:bg-fg/10">
    {text}
  </a>
{/snippet}

<aside class="sticky top-12 hidden md:flex flex-col w-50 float-left h-[calc(100vh-48px)]">
  <nav class="flex flex-col px-2 gap-1">
    {@render sidebarLink("/discover", "Discover")}
    {@render sidebarLink("/create", "Create")}
    {@render sidebarLink("/saved", "Saved")}
  </nav>
</aside>

<main class="overflow-y-auto h-[calc(100vh-48px)] md:rounded-tl-lg bg-bg-alt">
  {@render children()}
</main>
