import { create } from "zustand/index";

type StageVariant = "credentials" | "verification";
type RegisterFormStore = {
  stage: StageVariant;
  setStage: (value: StageVariant) => void;
};
export const useRegisterFormStore = create<RegisterFormStore>((set) => ({
  stage: "credentials",
  setStage: (value: StageVariant) => {
    set(() => ({
      stage: value,
    }));
  },
}));
