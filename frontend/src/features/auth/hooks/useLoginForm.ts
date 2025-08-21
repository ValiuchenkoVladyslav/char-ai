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
          new Promise<string>((resolve, reject) => {
            loginMutation.mutateAsync(result.data).then(async (data) => {
              const text = await data.text();
              if (data.status === 200) {
                resolve(text);
                setStage("verification");
              } else reject(text);
            });
          }),
          {
            loading: "Checking your password…",
            success: (data: string) => {
              return data;
            },
            error: (err) => {
              return err;
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
          new Promise<string>((resolve, reject) => {
            loginVerifiedMutation
              .mutateAsync(result.data)
              .then(async (data) => {
                const text = await data.text();
                if (data.status === 201) resolve(text);
                else reject(text);
              });
          }),
          {
            loading: "Checking code...",
            success: (data: string) => {
              return data;
            },
            error: (err) => {
              return err;
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
