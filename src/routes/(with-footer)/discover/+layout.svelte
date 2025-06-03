<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { page } from "$app/state";
  import { CHARACTERS_COUNT_LOAD_KEY, CHARACTERS_PER_PAGE } from "./shared";
  import HeadMeta from "$lib/components/head-meta.svelte";
  import Search from "lucide-svelte/icons/search";
  import ChevronRight from "lucide-svelte/icons/chevron-right";
  import ChevronsRight from "lucide-svelte/icons/chevrons-right";

  const { children, data } = $props();

  let query = $derived(page.url.searchParams.get("q") || "");
  let currPage = $derived(Number.parseInt(page.url.searchParams.get("p") || "1", 10) || 1);
  let maxPage = $state(0);
  $effect.pre(() => {
    data.charactersCount.then((count) => {
      // https://svelte.dev/docs/svelte/$effect#Understanding-dependencies
      // > Values that are read asynchronously — after an await or inside a setTimeout, for example — will not be tracked.
      maxPage = Math.ceil(count / CHARACTERS_PER_PAGE);
    });
  });

  const PAGINATION_ITEMS = 4;
  let paginationOffset = $derived(Math.max(1, Math.min(currPage - 1, maxPage - (PAGINATION_ITEMS - 1))));
</script>

<HeadMeta title="Discover Characters" />

<div class="self-center fixed top-0 py-2">
  <form
    action="/discover"
    class="flex items-center bg-bg-alt rounded-lg"
    onsubmit={() => invalidate(CHARACTERS_COUNT_LOAD_KEY)}
  >
    <input
      type="text"
      name="q"
      placeholder="Search characters..."
      class="px-4 text-lg py-1 w-80 rounded-l-lg"
    />
    <Search class="mx-2" />
  </form>
</div>

{@render children()}

{#if maxPage > 0}
  <nav class="flex py-2 gap-2 justify-center font-bold">
    <a
      href="/discover?p=1{query ? `&q=${query}` : ''}"
      class={["pagination-btn", currPage === 1 && "pointer-events-none opacity-50"]}
    >
      <ChevronsRight class="rotate-180" />
    </a>
    <a
      href="/discover?p={currPage - 1}{query ? `&q=${query}` : ''}"
      class={["pagination-btn", currPage === 1 && "pointer-events-none opacity-50"]}
    >
      <ChevronRight class="rotate-180" />
    </a>

    <!-- this offset makes current page display first by default (while current displays it as second by default) -->
    <!-- let paginationOffset = $derived(Math.max(0, Math.min(currPage - 1, maxPage - PAGINATION_ITEMS))); -->
    <!-- {@const page = paginationOffset + i + 1} -->
    {#each Array(Math.min(maxPage, PAGINATION_ITEMS)) as _, i}
      {@const page = paginationOffset + i}
      <a
        href="/discover?p={page}{query ? `&q=${query}` : ''}"
        class={["pagination-btn", page === currPage && "bg-fg/20"]}
      >
        {page}
      </a>
    {/each}

    <a
      href="/discover?p={currPage + 1}{query ? `&q=${query}` : ''}"
      class={["pagination-btn", currPage === maxPage && "pointer-events-none opacity-50"]}
    >
      <ChevronRight />
    </a>
    <a
      href="/discover?p={maxPage}{query ? `&q=${query}` : ''}"
      class={["pagination-btn", currPage === maxPage && "pointer-events-none opacity-50"]}
    >
      <ChevronsRight />
    </a>
  </nav>
{/if}
