import { create } from "zustand";
import type { StageForm } from "@/features/auth/interface/StageForm";

type LoginFormStore = {
  stage: StageForm;
  setStage: (value: StageForm) => void;
};
export const useLoginFormStore = create<LoginFormStore>((set) => ({
  stage: "credentials",
  setStage: (value: StageForm) => {
    set(() => ({
      stage: value,
    }));
  },
}));
