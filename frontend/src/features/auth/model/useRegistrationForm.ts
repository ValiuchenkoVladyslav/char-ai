import { confirmEmailDto, signUpDto } from "@repo/schema";
import { useState } from "react";
import { treeifyError, type ZodObject } from "zod/v4";
import {
  useRegisterMutation,
  useRegisterVerifiedMutation,
} from "@/features/auth/api/useRegisterMutation";
import type { FormError } from "@/features/auth/interface/formError";
import { useRegisterFormStore } from "@/features/auth/model/RegisterFormStore";

export function parseFormData<S extends ZodObject>(data: FormData, schema: S) {
  return schema.safeParseAsync(Object.fromEntries(data));
}
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
        registerMutation.mutate(result.data);
        setStage("verification");
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
        registerVerifiedMutation.mutate(result.data.token);
        setStage("verification");
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
