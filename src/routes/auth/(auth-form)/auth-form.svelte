<script lang="ts" generics="Schema extends ZodObject">
  import type { HTMLFormAttributes } from "svelte/elements";
  import type { SubmitFunction } from "@sveltejs/kit";
  import type { ZodObject, output, ZodSafeParseResult } from "zod/v4";
  import { enhance, applyAction } from "$app/forms";
  import { page } from "$app/state";
  import { parseFormData } from "$lib/utils";

  interface Props extends Omit<HTMLFormAttributes, "onsubmit"> {
    schema: Schema;
    onsubmit: (
      params: Parameters<SubmitFunction>[number],
      parseResult: ZodSafeParseResult<output<Schema>>,
    ) => void;
    heading: string;
  }

  const { children, onsubmit, schema, heading, ...props }: Props = $props();
</script>

<form
  method="POST"
  use:enhance={(props) => {
    onsubmit(props, parseFormData(props.formData, schema));

    return (res) => applyAction(res.result);
  }}
  novalidate
  class="card"
  {...props}
>
  <header class="flex justify-between items-center">
    <h2>{heading}</h2>

    {#if !page.url.pathname.startsWith("/auth/forgot-password")}
      <a href="/auth/forgot-password" class="opacity-70 hover:opacity-100 hover:underline">
        Forgot password?
      </a>
    {/if}
  </header>

  {@render children?.()}
</form>
