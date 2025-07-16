import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import { type Auth, useAuth } from "./use-auth";

export function useAuthSuccess(data: Auth | null | undefined): void;
export function useAuthSuccess(): (data?: Auth | null) => void;
export function useAuthSuccess(data?: Auth | null) {
  const router = useRouter();
  const setAuth = useAuth()[1];

  useLayoutEffect(() => {
    if (!data) return;

    setAuth(data);
    router.push("/success");
  }, [data, setAuth, router.push]);

  if (!data) return;

  return (data?: Auth | null) => {
    if (!data) return;

    setAuth(data);
    router.push("/success");
  };
}
