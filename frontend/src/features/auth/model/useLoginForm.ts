import { type SubmitHandler, useForm } from "react-hook-form";
import { email, object, string, type infer as z_infer } from "zod/v4";
import { useLoginFormStore } from "@/features/auth/model/LoginFormStore";

const LoginCredentialsDataSchema = object({
  email: email(),
  password: string(),
});
const LoginVerificationDataSchema = object({
  code: string().max(6),
});
type ILoginCredentialsData = z_infer<typeof LoginCredentialsDataSchema>;
type ILoginVerificationData = z_infer<typeof LoginVerificationDataSchema>;

export function useLoginForm() {
  const {
    register: registerCredentials,
    handleSubmit: handleSubmitCredentials,
  } = useForm<ILoginCredentialsData>();
  const {
    register: registerVerification,
    handleSubmit: handleSubmitVerification,
  } = useForm<ILoginVerificationData>({
    defaultValues: { code: "" },
  });
  const { stage, setStage } = useLoginFormStore();

  const onSubmitCredentials: SubmitHandler<ILoginCredentialsData> = async (
    data,
  ) => {
    if (stage === "credentials") {
      await new Promise<void>((resolve, _) => setTimeout(resolve, 1000));
    }
    setStage("verification");
  };
  const onSubmitVerification: SubmitHandler<ILoginVerificationData> = async (
    data,
  ) => {
    if (stage === "verification") {
      await new Promise<void>((resolve, _) => setTimeout(resolve, 1000));
    }
  };

  return {
    registerCredentials,
    handleSubmitCredentials,
    onSubmitCredentials,

    registerVerification,
    handleSubmitVerification,
    onSubmitVerification,
  };
}
