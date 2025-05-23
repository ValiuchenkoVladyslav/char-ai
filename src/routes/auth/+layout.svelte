<script lang="ts">
	const { children } = $props();
</script>

<div class="flex justify-center gap-6 mt-8 md:mt-16">
  <section class="w-[min(400px,100%)] *:w-[min(400px,100%)]">
    {@render children()}
  </section>

  <aside class="hidden md:block">
    <h1 class="text-4xl font-bold">Welcome to our App</h1>
    <p class="mt-4 text-lg">Please sign in or sign up to continue.</p>
    <p>TODO: add more text</p>
  </aside>
</div>
