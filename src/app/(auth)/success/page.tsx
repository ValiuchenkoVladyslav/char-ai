"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { useAuth } from "~/modules/auth/hooks/use-auth";

export default function SuccessPage() {
  const router = useRouter();
  const [user] = useAuth();

  useLayoutEffect(() => {
    if (!user) {
      router.push("/sign-in");
    }
    console.log("user", user);
  }, [user, router]);

  return <div className="p-base rounded-lg bg-bg-alt">success page!</div>;
}
