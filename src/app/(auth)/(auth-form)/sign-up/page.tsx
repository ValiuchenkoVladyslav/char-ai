"use client";

import { useActionState } from "react";

import { handleEmailPass } from "~/modules/auth/client";
import { displayNameBounds } from "~/modules/user/client";

import { Form } from "~/shared/components/form";
import { Input } from "~/shared/components/input";
import { ContinueBtn } from "../_components/continue-btn";
import { EmailInput } from "../_components/email-input";
import { PasswordInput } from "../_components/password-input";
import { UsernameInput } from "../_components/username-input";

const SUCCESS_PATH = "/sign-up/email-sent";
const MAGIC_LINK_PATH = "/sign-up/success";

export default function SignUpPage() {
  const [res, action, pending] = useActionState(
    (_: unknown, data: FormData) =>
      handleEmailPass(data, SUCCESS_PATH, MAGIC_LINK_PATH),
    null,
  );

  return (
    <Form action={action} className="flex flex-col gap-2">
      <UsernameInput />
      <Input
        label="Your Name"
        type="text"
        name="displayName"
        placeholder="John Doe"
        minLength={displayNameBounds.minLen}
        maxLength={displayNameBounds.maxLen}
      />
      <EmailInput />
      <PasswordInput />

      {res?.error ? <p className="text-red-500 py-3">{res.error}</p> : null}

      <ContinueBtn pending={pending} />
    </Form>
  );
}
