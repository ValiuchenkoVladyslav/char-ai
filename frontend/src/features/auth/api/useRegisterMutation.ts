import type { SignUpDto } from "@repo/schema";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api/api";

function registerMutation(form: SignUpDto) {
  return api.user["sign-up"].$post({
    form: form,
  });
}
export function useRegisterMutation() {
  return useMutation({
    mutationFn: registerMutation,
  });
}

function registerVerifiedMutation(token: string) {
  return api.user["sign-up"].confirm.$post({ form: { token } });
}
export function useRegisterVerifiedMutation() {
  return useMutation({
    mutationFn: registerVerifiedMutation,
  });
}
