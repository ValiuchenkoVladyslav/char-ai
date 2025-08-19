import { create } from "zustand";

type StageVariant = "credentials" | "verification";
type LoginFormStore = {
  stage: StageVariant;
  setStage: (value: StageVariant) => void;
};
export const useLoginFormStore = create<LoginFormStore>((set) => ({
  stage: "credentials",
  setStage: (value: StageVariant) => {
    set(() => ({
      stage: value,
    }));
  },
}));
