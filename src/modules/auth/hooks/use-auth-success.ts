import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";
import type { AuthData } from "../lib/base";
import { useAuth } from "./use-auth";

export function useAuthSuccess(data: AuthData | null | undefined): void;
export function useAuthSuccess(): (data?: AuthData | null) => void;
export function useAuthSuccess(data?: AuthData | null) {
  const router = useRouter();
  const setAuth = useAuth()[1];

  useLayoutEffect(() => {
    if (!data) return;

    setAuth(data);
    router.push("/success");
  }, [data, setAuth, router.push]);

  if (data) return;

  return (data?: AuthData | null) => {
    if (!data) return;

    setAuth(data);
    router.push("/success");
  };
}
