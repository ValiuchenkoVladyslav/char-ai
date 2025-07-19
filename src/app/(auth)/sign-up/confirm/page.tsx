"use client";

import { useLayoutEffect, useState } from "react";

import { setAuth, signUpEmailPass } from "~/modules/auth/client";

type Response = Awaited<ReturnType<typeof signUpEmailPass>>;

export default function ConfirmSignUpPage() {
  const [res, setRes] = useState<Response | null>(null);

  useLayoutEffect(() => {
    const token = new URL(location.href).searchParams.get("t");

    if (!token) throw new Error("No sign-up token found");

    signUpEmailPass(token).then((res) => {
      setRes(res);
      if (res.success) setAuth(res.data);
    });
  }, []);

  if (!res) {
    return <p>Loading...</p>;
  }

  if (!res.success) {
    throw new Error(res.error);
  }

  return <h3>Signed-Up successfully!</h3>;
}
