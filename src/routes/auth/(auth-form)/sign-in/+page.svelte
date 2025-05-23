<script lang="ts">
  import AuthForm from "../auth-form.svelte";
  import { signInSchema } from "./shared";
  import { Btn, Input, HeadMeta, ErrorBanner } from "$lib/components";
  import LogIn from "lucide-svelte/icons/log-in";
  import { getIssue } from "$lib/utils";

  const { form } = $props();
  let issues = $derived(form?.issues);
</script>

<HeadMeta title="Sign In"/>

<AuthForm
  heading="Sign In"
  schema={signInSchema}
  onsubmit={({ cancel }, parseResult) => {
    if (!parseResult.error) return;

    cancel();
    issues = parseResult.error.issues;
  }}
>
  <Input
    label="Email"
    placeholder="johndoe@gmail.com"
    type="email"
    error={getIssue(issues, "email")}
    name="email"
  />

  <Input
    label="Password"
    placeholder="********"
    type="password"
    error={getIssue(issues, "password")}
    name="password"
  />

  <ErrorBanner error={form?.error} />

  <Btn class="self-end mt-5">
    <LogIn />

    Continue
  </Btn>
</AuthForm>
