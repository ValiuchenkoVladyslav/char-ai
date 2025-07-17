"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { useAuth } from "~/modules/auth/client";

export default function SuccessPage() {
  const router = useRouter();
  const [user] = useAuth();

  useLayoutEffect(() => {
    if (user === null) router.push("/sign-in");
  }, [user, router]);

  return <div className="p-base rounded-lg bg-bg-alt">success page!</div>;
}
