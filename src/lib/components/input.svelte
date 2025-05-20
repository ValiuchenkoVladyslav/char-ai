<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  interface Props extends Omit<HTMLInputAttributes, "id"> {
    dark?: boolean;
    class?: string;
    error?: string;
    label?: string;
    name: string;
  }

  const { label, error, class: _class, dark, ...props }: Props = $props();
</script>

<section class="flex flex-col gap-2">
  <div class="flex justify-between">
    {#if label}
      <label for={props.name}>
        {label}
      </label>
    {/if}

    {#if error}
      <p class="text-red-600 text-sm" aria-roledescription="error">
        * {error}
      </p>
    {/if}
  </div>

  <input
    class={["input", dark ? "dark" : "light", _class]}
    id={props.name}
    {...props}
  />
</section>
