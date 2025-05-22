<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { env } from "$env/dynamic/public";

  const { children } = $props();

  let tokenClient: google.accounts.oauth2.TokenClient | undefined;
</script>

<div>
  <script
    defer
    async
    src="https://accounts.google.com/gsi/client"
    onload={() => {
      // i spent 1.5 hours digging inside some react lib, @types/some-google-shit,
      // reading google docs, debating with gpt hallucination and reading stack overflow
      // to find this solution 
      tokenClient = window?.google.accounts.oauth2.initTokenClient({
        client_id: env.PUBLIC_OAUTH2_CLIENT_ID,
        scope: "openid email profile",
        callback(res) {
          goto("/auth/google/" + res.access_token);
        },
      });
    }}
  ></script>
</div>

<div class="flex flex-col gap-2 w-[min(400px,100%)] *:rounded-lg">
  <nav class="p-1 flex gap-1 bg-fg/15 *:w-1/2 *:rounded-md *:font-semibold *:text-center *:py-1">
    {#snippet tabLink(href: string, text: string)}
      <a {href} class={page.url.pathname === href ? "bg-bg" : "text-fg/70"}>
        {text}
      </a>
    {/snippet}

    {@render tabLink("/auth/sign-in", "Sign In")}
    {@render tabLink("/auth/sign-up", "Sign Up")}
  </nav>

  <button
    class="light h-[40px] flex items-center justify-center gap-2 font-semibold"
    onclick={() => tokenClient?.requestAccessToken()}
  >
    <svg width="25" height="25" viewBox="0 0 48 48">
      <title>Google Logo</title>
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>

    Continue with Google
  </button>

  {@render children()}
</div>
