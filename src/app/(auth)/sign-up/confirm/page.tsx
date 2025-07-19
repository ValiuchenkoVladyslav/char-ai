"use client";

import { useLayoutEffect, useState } from "react";

import { setUser, signUpEmailPass } from "~/modules/auth/client";
import { err } from "~/shared/lib/utils";

type Response = Awaited<ReturnType<typeof signUpEmailPass>>;

export default function ConfirmSignUpPage() {
  const [res, setRes] = useState<Response>();

  useLayoutEffect(() => {
    const token = new URL(location.href).searchParams.get("t");

    if (!token) {
      setRes(err("No sign-up token found"));
      return;
    }

    signUpEmailPass(token)
      .then((res) => {
        setRes(res);
        if (res.success) setUser(res.data);
      })
      .catch((error) => {
        setRes(err(error?.message || "Sign-up failed"));
      });
  }, []);

  if (!res) {
    return <p>Loading...</p>;
  }

  if (!res.success) {
    return (
      <div>
        <h3 className="text-red-500">Error occurred!</h3>
        <p>{res.error}</p>
      </div>
    );
  }

  return <h3>Signed-Up successfully!</h3>;
}
