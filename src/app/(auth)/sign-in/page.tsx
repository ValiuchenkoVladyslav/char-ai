"use client";

import Link from "next/link";
import { useActionState } from "react";

import { handleSignInForm } from "~/modules/auth/client";

import { Form } from "~/shared/components/form";
import { ContinueBtn } from "../_components/continue-btn";
import { EmailInput } from "../_components/email-input";
import { PasswordInput } from "../_components/password-input";

const SUCCESS_PATH = "/sign-in/email-sent";
const CONFIRM_PATH = "/sign-in/confirm";

export default function SignInPage() {
  const [res, action, pending] = useActionState(
    (_: unknown, data: FormData) =>
      handleSignInForm(data, SUCCESS_PATH, CONFIRM_PATH),
    null,
  );

  return (
    <Form action={action} className="flex flex-col gap-2">
      <EmailInput />
      <PasswordInput />

      {res?.error && <p className="text-red-500 py-3">{res.error}</p>}

      <Link href="/forgot-password" className="opacity-70 hover:underline">
        Forgot Password?
      </Link>

      <ContinueBtn pending={pending} />
    </Form>
  );
}
