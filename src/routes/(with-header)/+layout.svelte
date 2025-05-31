<script lang="ts">
  import LogIn from "lucide-svelte/icons/log-in";
  import User from "lucide-svelte/icons/user";

  const { children, data } = $props();
</script>

<header class="sticky top-0 h-12 bg-bg flex items-center justify-between px-2">
  <nav class="flex items-center">
    <a href="/" class="w-46 px-3 flex items-center text-lg gap-2 h-10 rounded-lg hover:bg-fg/10">
      Char Ai
    </a>
  </nav>

  {#await data.user then user}
    {#if user}
      <button class="bg-gray-900 h-9 w-9 rounded-full mr-3 overflow-hidden">
        {#if user?.pfp}
          <img src={user.pfp} alt="User Profile" class="w-full h-full" />
        {:else}
          <User class="w-full h-full" />
        {/if}
      </button>
    {:else}
      <a href="/auth/sign-in" class="px-3 flex items-center text-lg gap-2 h-10 rounded-lg hover:bg-fg/10">      
        Sign In

        <LogIn size={20} />
      </a>
    {/if}
  {/await}
</header>

{@render children()}
