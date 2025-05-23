<script lang="ts">
  import HeadMeta from "$lib/components/head-meta.svelte";
  import EmailSent from "../../email-sent.svelte";
</script>

<HeadMeta title="Email Sent" noindex />

<EmailSent
  title="Password Reset Request"
	description="Request created successfully."
	action="We sent password reset link to"
/>
