<script lang="ts">
	const { children } = $props();
</script>

<div class="flex w-screen h-screen">
  <main class="flex justify-center items-start mt-8 md:mt-26 w-full md:w-2/3">
    {@render children()}
  </main>

  <aside class="hidden md:block flex-1 pt-26 bg-fg/10 px-8">
    <h1 class="text-4xl font-bold">Welcome to our App</h1>
    <p class="mt-4 text-lg">Please sign in or sign up to continue.</p>
    <p>TODO: add more text</p>
  </aside>
</div>
