import { create } from "zustand";
import type { StageForm } from "@/features/auth/interface/StageForm";

type RegisterFormStore = {
  stage: StageForm;
  setStage: (value: StageForm) => void;
};
export const useRegisterFormStore = create<RegisterFormStore>((set) => ({
  stage: "credentials",
  setStage: (value: StageForm) => {
    set(() => ({
      stage: value,
    }));
  },
}));
