<script lang="ts">
  import { enhance, applyAction } from "$app/forms";
  import type { Snippet } from "svelte";
  import type { SubmitFunction } from "@sveltejs/kit";
  import type { HTMLFormAttributes } from "svelte/elements";

  interface AuthFormProps extends HTMLFormAttributes {
    onSubmit: (...params: Parameters<SubmitFunction>) => void;
    children: Snippet;
    heading: string;
  }

  const { children, onSubmit, heading, ...props }: AuthFormProps = $props();
</script>

<form
  method="POST"
  use:enhance={(props) => {
    onSubmit(props);

    return (res) => applyAction(res.result);
  }}
  novalidate
  class="p-4 border-1 flex flex-col gap-4"
  {...props}
>
  <h2>{heading}</h2>

  {@render children()}
</form>
