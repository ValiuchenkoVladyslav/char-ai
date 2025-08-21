import { confirmEmailDto, signUpDto } from "@repo/schema";
import { useState } from "react";
import { toast } from "sonner";
import { treeifyError } from "zod/v4";
import {
  useRegisterMutation,
  useRegisterVerifiedMutation,
} from "@/features/auth/api/useRegisterMutation";
import type { FormError } from "@/features/auth/interface/formError";
import { useRegisterFormStore } from "@/features/auth/model/RegisterFormStore";
import { parseFormData } from "@/shared/lib/parseFormData";

export function useRegisterForm() {
  const { setStage, stage } = useRegisterFormStore();
  const [errors, setErrors] = useState<FormError[]>([]);
  const registerMutation = useRegisterMutation();
  const registerVerifiedMutation = useRegisterVerifiedMutation();

  async function onSubmitCredentials(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (stage === "credentials") {
      const formData = new FormData(e.currentTarget);
      const result = await parseFormData(formData, signUpDto);
      if (result.success) {
        toast.promise(
          (async () => {
            const res = await registerMutation.mutateAsync(result.data);
            const text = await res.text();
            if (res.status === 200) {
              setStage("verification");
              return text;
            }
            throw new Error(text);
          })(),
          {
            loading: "Sending a verification token to your email...",
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
            const res = await registerVerifiedMutation.mutateAsync(result.data);
            const text = await res.text();
            if (res.status === 201) {
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
