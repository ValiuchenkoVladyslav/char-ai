<!-- generic email sent page -->

<script lang="ts">
  interface Props {
    title: string;
    description: string;
    action: string;
  }

  const props: Props = $props();

  // svelte-ignore non_reactive_update
  let toEmail = "...";
  $effect.pre(() => {  
    toEmail = location.hash.substring(1) || "...";
  });
</script>

<section class="card">
  <header>
    <h2>{props.title}</h2>
    <p class="mt-1">{props.description}</p>
  </header>

  <section class="flex flex-col gap-1">
    <p>{props.action}</p>
    <b>{toEmail}</b>
    <p class="block text-fg/70">
      Check your inbox and follow instructions given in received email.
    </p>
  </section>
</section>
