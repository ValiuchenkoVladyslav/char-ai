<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface BtnProps extends HTMLButtonAttributes {
    dark?: boolean;
    class?: string;
  }

  const { dark, children, class: _class, ...props }: BtnProps = $props();
</script>

<button class={["btn", dark ? "dark" : "light", _class]} {...props}>
  {@render children?.()}
</button>
