<script lang="ts">
  import TriangleAlert from "lucide-svelte/icons/triangle-alert";

  interface Props {
    error?: string;
  }

  const { error }: Props = $props();
</script>

<p
  class="border-2 border-red-600/70 bg-red-600/20 rounded-md px-3 py-2 flex gap-2"
  hidden={error === undefined}
  aria-hidden={error === undefined}
  aria-roledescription="error"
>
  <TriangleAlert />

  {error}
</p>
