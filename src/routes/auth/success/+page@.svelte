<script lang="ts">
  import { invalidate } from "$app/navigation";
  import { AUTH_LOAD_KEY } from "$lib/utils";

  const { data } = $props();

  $effect.pre(() => {
    data.user.then((user) => {
      if (!user) {
        invalidate(AUTH_LOAD_KEY);
      }
    });
  });
</script>

<h1 class="text-center pt-18">Now you're in!</h1>
