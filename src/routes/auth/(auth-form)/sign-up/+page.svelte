<script lang="ts">
  import AuthForm from "../auth-form.svelte";
  import { validateSignUpFormData } from "./shared";
  import { Btn, Input, HeadMeta, ErrorBanner } from "$lib/components";
  import LogIn from "lucide-svelte/icons/log-in";
  import { getIssue } from "$lib/utils";

  let { form } = $props();
  let issues = $derived(form?.issues);
</script>

<HeadMeta title="Sign Up"/>

<AuthForm
  heading="Sign Up"
  onSubmit={({ formData, cancel }) => {
    const res = validateSignUpFormData(formData);

    if (!res.error) return;

    cancel();
    issues = res.error.issues;
  }}
>
  <Input
    label="Name"
    placeholder="John Doe"
    type="text"
    error={getIssue(issues, "displayName")}
    name="displayName"
  />

  <Input
    label="Username"
    placeholder="johndoe"
    type="text"
    error={getIssue(issues, "username")}
    name="username"
  />

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
