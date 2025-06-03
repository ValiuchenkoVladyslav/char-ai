<script lang="ts">
  import { CHARACTERS_PER_PAGE } from "./shared";

  const { data } = $props();
</script>

{#await data.topCharacters}
  <main class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 px-8 lg:px-16 pt-12">
    {#each Array(CHARACTERS_PER_PAGE) as _0, _1}
      <article class="bg-bg-alt rounded-lg p-4 h-124 animate-pulse">
      </article>
    {/each}
  </main>
{:then topCharacters}
  {#if !topCharacters || topCharacters.length === 0}
    <p class="text-center text-fg/50 text-lg">
      No characters found.
    </p>
  {:else}
    <main class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 px-8 lg:px-16 pt-12">
      {#each topCharacters as character}
        <a href="/characters/${character.id}" class="bg-bg-alt rounded-lg p-4 h-124">
          <div class="h-full flex flex-col">
            <img src={character.pfp} alt={character.name} class="w-full h-32 object-cover rounded mb-4" />
            <h3 class="font-semibold text-lg mb-2">{character.name}</h3>
            <p class="text-fg/70 text-sm flex-1">
              {character.description || 'No description available'}
            </p>
          </div>
        </a>
      {/each}
    </main>
  {/if}
{/await}
