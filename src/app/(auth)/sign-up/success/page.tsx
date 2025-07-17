"use client";

import { useSearchParams } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { createUserEmailPass, setAuth } from "~/modules/auth/client";

export default function SuccessSignUpPage() {
  const token = useSearchParams().get("t");
  const [res, setRes] = useState<null | Awaited<
    ReturnType<typeof createUserEmailPass>
  >>(null);

  useLayoutEffect(() => {
    if (!token) return;

    createUserEmailPass(token).then((res) => {
      setRes(res);
      if (res.success) setAuth(res.data);
    });
  }, [token]);

  if (!token) {
    return (
      <>
        <h3 className="text-red-500">Unknown error occurred!</h3>
        <p>Please check the link we sent to your email.</p>
      </>
    );
  }

  if (!res) {
    return <p>Loading...</p>;
  }

  if (!res.success) {
    return (
      <>
        <h3 className="text-red-500">Error occurred!</h3>
        <p>{res.error}</p>
      </>
    );
  }

  return <h3>Welcome to Char Ai!</h3>;
}
