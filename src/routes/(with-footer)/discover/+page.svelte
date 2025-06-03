<script lang="ts">
  import { CHARACTERS_PER_PAGE } from "./shared";

  const { data } = $props();
</script>

{#await data.topCharacters}
  {#each Array(CHARACTERS_PER_PAGE) as _0, _1}
    <article class="bg-bg-alt rounded-lg p-4 h-124 animate-pulse">
    </article>
  {/each}
{:then topCharacters}
  {#each topCharacters as character}
    <article class="bg-bg-alt rounded-lg p-4 h-124">
      <p>{character}</p>
    </article>
  {/each}
{/await}
