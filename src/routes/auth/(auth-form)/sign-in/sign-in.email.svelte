<script lang="ts">
  import { env } from "$env/dynamic/public";

  interface Props {
    signInToken: string;
  }

  const { signInToken }: Props = $props();
</script>

<a href="{env.PUBLIC_SITE_URL}/auth/sign-in/{signInToken}" target="_blank">
  Click here to Sign In
</a>

<br/>

<p>Ignore this email if it wasn't you!</p>
