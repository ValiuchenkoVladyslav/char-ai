import type { SignUpDto } from "@repo/schema";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api/api";

async function registerMutation(form: SignUpDto) {
  return await api.user["sign-up"].$post({
    form: form,
  });
}
export function useRegisterMutation() {
  return useMutation({
    mutationFn: registerMutation,
  });
}

async function registerVerifiedMutation(token: string) {
  return await api.user["sign-up"].confirm.$post({ form: { token } });
}
export function useRegisterVerifiedMutation() {
  return useMutation({
    mutationFn: registerVerifiedMutation,
  });
}
