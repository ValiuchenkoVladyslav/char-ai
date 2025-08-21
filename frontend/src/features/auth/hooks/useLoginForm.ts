import { confirmEmailDto, signInDto } from "@repo/schema";
import { useState } from "react";
import { toast } from "sonner";
import { treeifyError } from "zod/v4";
import {
  useLoginMutation,
  useLoginVerifiedMutation,
} from "@/features/auth/api/useLoginMutation";
import type { FormError } from "@/features/auth/interface/formError";
import { useLoginFormStore } from "@/features/auth/model/LoginFormStore";
import { parseFormData } from "@/shared/lib/parseFormData";

export function useLoginForm() {
  const { stage, setStage } = useLoginFormStore();
  const [errors, setErrors] = useState<FormError[]>([]);
  const loginMutation = useLoginMutation();
  const loginVerifiedMutation = useLoginVerifiedMutation();

  async function onSubmitCredentials(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (stage === "credentials") {
      const formData = new FormData(e.currentTarget);
      const result = await parseFormData(formData, signInDto);
      if (result.success) {
        toast.promise(
          (async () => {
            const res = await loginMutation.mutateAsync(result.data);
            const text = await res.text();
            if (res.status === 200) {
              setStage("verification");
              return text;
            }
            throw new Error(text);
          })(),
          {
            loading: "Checking your password…",
            success: (data: string) => {
              return data;
            },
            error: (err) => {
              return err instanceof Error ? err.message : String(err);
            },
          },
        );
      } else {
        const treeErrors = treeifyError(result.error).properties;
        if (treeErrors) {
          const arrayError: FormError[] = [];
          const keys = Object.keys(treeErrors) as (keyof typeof treeErrors)[];
          keys.forEach((key) => {
            if (treeErrors?.[key]) {
              treeErrors?.[key]?.errors.forEach((error) => {
                arrayError.push({ title: key, message: error });
              });
            }
          });
          setErrors(arrayError);
        }
      }
    }
  }
  async function onSubmitVerified(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (stage === "verification") {
      const formData = new FormData(e.currentTarget);
      const result = await parseFormData(formData, confirmEmailDto);
      if (result.success) {
        toast.promise(
          (async () => {
            const res = await loginVerifiedMutation.mutateAsync(result.data);
            const text = await res.text();
            if (res.status === 200) {
              return text;
            }
            throw new Error(text);
          })(),
          {
            loading: "Checking code...",
            success: (data: string) => {
              return data;
            },
            error: (err) => {
              return err instanceof Error ? err.message : String(err);
            },
          },
        );
      } else {
        const treeErrors = treeifyError(result.error).properties;
        if (treeErrors) {
          const arrayError: FormError[] = [];
          const keys = Object.keys(treeErrors) as (keyof typeof treeErrors)[];
          keys.forEach((key) => {
            if (treeErrors?.[key]) {
              treeErrors?.[key]?.errors.forEach((error) => {
                arrayError.push({ title: key, message: error });
              });
            }
          });
          setErrors(arrayError);
        }
      }
    }
  }

  return {
    onSubmitCredentials,
    onSubmitVerified,
    errors,
  };
}
