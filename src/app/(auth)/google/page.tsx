"use client";

import { useRouter } from "next/navigation";
import { useActionState, useLayoutEffect } from "react";

import { createUserOAuth2, setAuth } from "~/modules/auth/client";

import { Form } from "~/shared/components/form";
import { ContinueBtn } from "../_components/continue-btn";
import { UsernameInput } from "../_components/username-input";

export default function CreateGoogleUserPage() {
  const router = useRouter();
  const [res, action, pending] = useActionState(createUserOAuth2, null);

  useLayoutEffect(() => {
    if (res?.success) {
      setAuth(res.data);
      router.push("/google/success");
    }
  }, [router, res]);

  return (
    <Form action={action} className="flex flex-col gap-2">
      <UsernameInput />

      <ContinueBtn pending={pending} />
    </Form>
  );
}
