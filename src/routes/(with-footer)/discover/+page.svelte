<script lang="ts">
  import { CHARACTERS_PER_PAGE } from "./shared";

  const { data } = $props();
</script>

{#await data.topCharacters}
  <section class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 px-8 lg:px-16 pt-12">
    {#each Array(CHARACTERS_PER_PAGE) as _0, _1}
      <article class="bg-bg-alt rounded-lg p-4 h-124 animate-pulse">
      </article>
    {/each}
  </section>
{:then topCharacters}
  {#if !topCharacters || topCharacters.length === 0}
    <p class="text-center text-fg/50 text-lg">
      No characters found.
    </p>
  {:else}
    <section class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 px-8 lg:px-16 pt-12">
      {#each topCharacters as character}
        <a href="/characters/${character.id}" class="bg-bg-alt rounded-lg p-4 h-124">
          <p>{character}</p>
        </a>
      {/each}
    </section>
  {/if}
{/await}
