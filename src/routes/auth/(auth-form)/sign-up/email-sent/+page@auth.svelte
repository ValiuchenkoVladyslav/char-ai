<script lang="ts">
  import HeadMeta from "$lib/components/head-meta.svelte";
  import EmailSent from "../../email-sent.svelte";
</script>

<HeadMeta title="Email Sent" noindex />

<EmailSent
  title="You're almost there!"
	description="But we need to verify your email first."
	action="We sent a verification link to"
/>
