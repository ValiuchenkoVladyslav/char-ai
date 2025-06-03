<script lang="ts">
  import type { HTMLAnchorAttributes } from "svelte/elements";
  import { page } from "$app/state";

  interface Props extends HTMLAnchorAttributes {
    class?: string;
    href: string;
  }

  const { children, class: _class, ...props }: Props = $props();

  const isActive = $derived.by(() => {
    if (props.href === "/") {
      return page.url.pathname === "/";
    }

    return page.url.pathname.startsWith(props.href);
  });
</script>

<a class={["nav-link", isActive && "bg-fg/10", _class]} {...props}>
  {@render children?.()}
</a>
