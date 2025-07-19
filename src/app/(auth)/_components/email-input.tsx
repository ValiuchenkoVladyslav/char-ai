import { emailBounds } from "~/modules/user/client";
import { Input } from "~/shared/components/input";

export function EmailInput() {
  return (
    <Input
      label="Email"
      type="email"
      name="email"
      placeholder="you@example.com"
      minLength={emailBounds.minLen}
      maxLength={emailBounds.maxLen}
    />
  );
}
