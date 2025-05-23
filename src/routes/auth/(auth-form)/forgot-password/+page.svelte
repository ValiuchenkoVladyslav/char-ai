<script lang="ts">
  import AuthForm from "../auth-form.svelte";
  import { forgotPasswordSchema } from "./shared";
  import { Btn, Input, HeadMeta } from "$lib/components";
  import LogIn from "lucide-svelte/icons/log-in";
  import { getIssue } from "$lib/utils";

  const { form } = $props();
  let issues = $derived(form?.issues);
</script>

<HeadMeta title="Forgot Password"/>

<AuthForm
  heading="Forgot Password"
  schema={forgotPasswordSchema}
  onsubmit={({ cancel }, parseResult) => {
    if (!parseResult.error) return;

    cancel();
    issues = parseResult.error.issues;
  }}
>
  <p class="opacity-70">
    — No problem! We can send password reset link to your email.
  </p>

  <Input
    label="Email"
    placeholder="johndoe@gmail.com"
    type="email"
    error={getIssue(issues, "email")}
    name="email"
  />

  <Btn class="self-end mt-5">
    <LogIn />

    Continue
  </Btn>
</AuthForm>
