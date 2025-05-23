<script lang="ts">
  import AuthForm from "../../auth-form.svelte";
  import { Btn, ErrorBanner, HeadMeta, Input } from "$lib/components";
  import { changePasswordSchema } from "./shared";
  import LogIn from "lucide-svelte/icons/log-in";

  const { form } = $props();
  let issues = $derived(form?.issues);
</script>

<HeadMeta title="Change Password" noindex />

<AuthForm
  heading="Change Password"
  schema={changePasswordSchema}
  onsubmit={({ cancel }, parseResult) => {
    if (!parseResult.error) return;

    cancel();
    issues = parseResult.error.issues;
  }}
>
  <Input
    label="New Password"
    placeholder="********"
    type="password"
    name="password"
  />

  <ErrorBanner error={form?.error} />

  <Btn class="self-end mt-5">
    <LogIn />

    Set Password
  </Btn>
</AuthForm>
