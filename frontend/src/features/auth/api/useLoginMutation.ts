import type { ConfirmEmailDto, SignInDto } from "@repo/schema";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/shared/api/api";

function loginMutation(form: SignInDto) {
  return api.user["sign-in"].$post({
    form: form,
  });
}
export function useLoginMutation() {
  return useMutation({
    mutationFn: loginMutation,
  });
}

function loginVerifiedMutation(confirmEmailDto: ConfirmEmailDto) {
  return api.user["sign-up"].confirm.$post({ form: confirmEmailDto });
}
export function useLoginVerifiedMutation() {
  return useMutation({
    mutationFn: loginVerifiedMutation,
  });
}
