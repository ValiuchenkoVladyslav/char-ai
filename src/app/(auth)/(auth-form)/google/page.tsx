"use client";

import { LoaderCircle, LogIn } from "lucide-react";
import { useActionState } from "react";
import { createUserOAuth2, useAuthSuccess } from "~/modules/auth/client";
import { Form } from "~/shared/components/form";
import { UsernameInput } from "../_components/username-input";

export default function CreateGoogleUserPage() {
  const [res, action, pending] = useActionState(createUserOAuth2, null);
  useAuthSuccess(res?.data);

  return (
    <Form action={action} className="flex flex-col gap-2">
      <UsernameInput />

      <div className="mt-3">
        <button type="submit" className="btn bg-fg text-bg" disabled={pending}>
          Continue
          {pending ? <LoaderCircle className="animate-spin" /> : <LogIn />}
        </button>
      </div>
    </Form>
  );
}
