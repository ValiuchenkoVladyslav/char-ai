<!-- generic email sent page -->

<script lang="ts">
  interface Props {
    title: string;
    description: string;
    action: string;
    email: string;
  }

  const props: Props = $props();
</script>

<section class="w-[min(400px,100%)] rounded-lg p-4 border-1">
  <section class="mb-5">
    <h2>{props.title}</h2>
    <p class="mt-1">{props.description}</p>
  </section>

  <section class="flex flex-col gap-1">
    <p>{props.action}</p>
    <b>{props.email}</b>
    <p class="block text-fg/70">
      Check your inbox and follow instructions given in received email.
    </p>
  </section>
</section>
