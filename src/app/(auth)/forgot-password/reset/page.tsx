"use client";

import { useActionState, useLayoutEffect, useState } from "react";

import { resetPassword, setUser } from "~/modules/auth/client";

import { Form } from "~/shared/components/form";
import { ContinueBtn } from "../../_components/continue-btn";
import { PasswordInput } from "../../_components/password-input";

export default function ResetPasswordPage() {
  const [token, setToken] = useState<string | null>(null);
  const [res, action, pending] = useActionState(
    // biome-ignore lint/style/noNonNullAssertion: we check token below
    (_: unknown, data: FormData) => resetPassword(data, token!),
    null,
  );

  useLayoutEffect(() => {
    setToken(new URL(location.href).searchParams.get("t"));
  }, []);

  useLayoutEffect(() => {
    if (res?.success) setUser(res.data);
  }, [res]);

  if (!token) {
    return <p className="text-red-500 py-3">Invalid or missing token</p>;
  }

  if (res?.success) {
    return <p className="text-green-500 py-3">Password reset successfully!</p>;
  }

  return (
    <Form action={action} className="flex flex-col gap-2">
      <PasswordInput />

      {res?.success ? null : <p className="text-red-500 py-3">{res?.error}</p>}

      <ContinueBtn pending={pending} />
    </Form>
  );
}
