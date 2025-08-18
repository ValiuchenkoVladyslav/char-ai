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
    onSuccess: (data) => {
      console.log("Sign up start:", data);
    },
    onError: (error) => {
      console.error("Error Sign up:", error);
    },
  });
}

async function registerVerifiedMutation(token: string) {
  console.log("start");
  const data = await api.user["sign-up"].confirm.$post({ form: { token } });
  console.log(data);
  console.log("end");

  return data;
}
export function useRegisterVerifiedMutation() {
  return useMutation({
    mutationFn: registerVerifiedMutation,
    onSuccess: (data) => {
      console.log("User created:", data);
    },
    onError: (error) => {
      console.error("Error creating user:", error);
    },
  });
}
