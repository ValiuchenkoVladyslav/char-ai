<script lang="ts">
  import { env } from "$env/dynamic/public";

  interface Props {
    signUpToken: string;
  }

  const { signUpToken }: Props = $props();
</script>

<a href="{env.PUBLIC_SITE_URL}/auth/sign-up/{signUpToken}" target="_blank">
  Click here to Sign Up
</a>

<br/>

<p>Ignore this email if it wasn't you!</p>
