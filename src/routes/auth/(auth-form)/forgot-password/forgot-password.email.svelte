<script lang="ts">
  import { env } from "$env/dynamic/public";

  interface Props {
    passwordResetToken: string;
  }

  const { passwordResetToken }: Props = $props();
</script>

<a href="{env.PUBLIC_SITE_URL}/auth/sign-in/{passwordResetToken}" target="_blank">
  Click here to reset your Password
</a>

<br/>

<p>Ignore this email if it wasn't you!</p>
