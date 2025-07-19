import { LoaderCircle, LogIn } from "lucide-react";

namespace ContinueBtn {
  export interface Props {
    pending: boolean;
  }
}

export function ContinueBtn({ pending }: ContinueBtn.Props) {
  return (
    <div className="pt-4">
      <button type="submit" className="btn bg-fg text-bg" disabled={pending}>
        Continue
        {pending ? <LoaderCircle className="animate-spin" /> : <LogIn />}
      </button>
    </div>
  );
}
