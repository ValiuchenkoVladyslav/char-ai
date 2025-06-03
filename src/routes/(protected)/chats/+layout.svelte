<script lang="ts">
  const { children } = $props();
</script>

<div class="flex flex-1"> 
  <aside class="w-48 px-6">
    sidebar
  </aside>

  <main class="flex-1 bg-bg-alt rounded-tl-lg p-4">
    {@render children()}
  </main>
</div>
