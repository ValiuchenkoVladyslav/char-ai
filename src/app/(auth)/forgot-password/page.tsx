"use client";

import { useActionState } from "react";

import { passwordResetRequest } from "~/modules/auth/client";

import { Form } from "~/shared/components/form";
import { ContinueBtn } from "../_components/continue-btn";
import { EmailInput } from "../_components/email-input";

const SUCCESS_PATH = "/forgot-password/email-sent";
const RESET_PATH = "/forgot-password/reset";

export default function ForgotPasswordPage() {
  const [res, action, pending] = useActionState(
    (_: unknown, data: FormData) =>
      passwordResetRequest(data, SUCCESS_PATH, RESET_PATH),
    null,
  );

  return (
    <Form action={action} className="flex flex-col gap-2">
      <EmailInput />

      {res?.error && <p className="text-red-500 py-3">{res.error}</p>}

      <ContinueBtn pending={pending} />
    </Form>
  );
}
