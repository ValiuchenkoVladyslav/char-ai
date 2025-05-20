<script lang="ts">
  import AuthForm from "../auth-form.svelte";
  import { validateSignInFormData } from "./shared";
  import Btn from "$lib/components/btn.svelte";
  import Input from "$lib/components/input.svelte";
  import HeadMeta from "$lib/components/head-meta.svelte";
  import ErrorBanner from "$lib/components/error-banner.svelte";
  import LogIn from "lucide-svelte/icons/log-in";
  import { getIssue } from "$lib/utils";

  const { form } = $props();
  const issues = $derived(form?.issues);
  const error = $derived(form?.error);
</script>

<HeadMeta title="Sign In"/>

<AuthForm
  heading="Sign In"
  onSubmit={({ formData, cancel }) => {
    const res = validateSignInFormData(formData);
    
    if (!res.error) return;

    cancel();
    issues = res.error.issues;
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

  <ErrorBanner {error} />

  <Btn class="self-end mt-5">
    <LogIn />

    Continue
  </Btn>
</AuthForm>
