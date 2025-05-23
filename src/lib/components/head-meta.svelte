<script lang="ts">
  interface Props {
    title: string;
    description?: string;
    noindex?: boolean;
  }

  const props: Props = $props();
</script>

<svelte:head>
  <title>{"CharAi | " + props.title}</title>
  <meta name="description" content={props.description ?? "CharAi — Build and discover ai personalities from any universe!"}/>

  {#if props.noindex}
    <meta name="robots" content="noindex"/>
  {/if}
</svelte:head>
