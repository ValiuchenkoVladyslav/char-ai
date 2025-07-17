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

  return <h3>Welcome to Char Ai!</h3>;
}
