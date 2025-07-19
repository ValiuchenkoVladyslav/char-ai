"use client";

import { useLayoutEffect, useState } from "react";

import { setUser, signUpEmailPass } from "~/modules/auth/client";

type Response = Awaited<ReturnType<typeof signUpEmailPass>>;

export default function ConfirmSignUpPage() {
  const [res, setRes] = useState<Response>();

  useLayoutEffect(() => {
    const token = new URL(location.href).searchParams.get("t");

    if (!token) throw new Error("No sign-up token found");

    signUpEmailPass(token).then((res) => {
      setRes(res);
      if (res.success) setUser(res.data);
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
