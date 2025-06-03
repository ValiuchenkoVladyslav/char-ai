<script lang="ts">
  import "../app.css";

  import LogIn from "lucide-svelte/icons/log-in";
  import User from "lucide-svelte/icons/user";
  import Compass from "lucide-svelte/icons/compass";
  import Brush from "lucide-svelte/icons/brush";
  import MessageCircleMore from "lucide-svelte/icons/message-circle-more";

  import { NavLink } from "$lib/components";

  const { children, data } = $props();
</script>

<header class="sticky top-0 h-13 bg-bg flex items-center justify-between px-2">
  <nav class="flex items-center gap-2">
    <NavLink href="/">
      <img src="/favicon.png" alt="Logo" class="w-[20px] h-[20px]" />
      Char Ai
    </NavLink>

    <NavLink href="/discover">
      <Compass size={20} />
      Discover
    </NavLink>
  </nav>

  <div class="flex items-center gap-2">    
    {#await data.user}
      <p class="text-lg">
        Loading...
      </p>
    {:then user}
      {#if user}
        <NavLink href="/create">
          Create
          <Brush size={20} />
        </NavLink>

        <NavLink href="/chats">
          My Chats
          <MessageCircleMore size={20} />
        </NavLink>

        <button popovertarget="profile" class="mr-3 bg-gray-900 h-9 w-9 rounded-full overflow-hidden">
          {#if user?.pfp}
            <img src={user.pfp} alt="User Profile" class="w-full h-full" />
          {:else}
            <User class="w-full h-full" />
          {/if}
        </button>

        <div popover id="profile" class="fixed left-auto mr-5 mt-12 rounded-lg border-fg/10 border-2 bg-bg-alt text-fg p-3">
          testing popover
        </div>
      {:else}
        <NavLink href="/auth/sign-in">
          Sign In
          <LogIn size={20} />
        </NavLink>
      {/if}
    {/await}
  </div>
</header>

{@render children()}
