<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props extends HTMLButtonAttributes {
    dark?: boolean;
    class?: string;
  }

  const { dark, children, class: _class, ...props }: Props = $props();
</script>

<button class={["btn", dark ? "dark" : "light", _class]} {...props}>
  {@render children?.()}
</button>
