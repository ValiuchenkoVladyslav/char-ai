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

  {#if props.description}
    <meta name="description" content={props.description}/>
  {/if}

  {#if props.noindex}
    <meta name="robots" content="noindex"/>
  {/if}
</svelte:head>
