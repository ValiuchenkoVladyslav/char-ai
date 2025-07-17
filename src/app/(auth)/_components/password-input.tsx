import { passwordBounds } from "~/modules/user/client";
import { Input } from "~/shared/components/input";

export function PasswordInput() {
  return (
    <Input
      label="Password"
      type="password"
      name="password"
      placeholder="••••••••••"
      minLength={passwordBounds.minLen}
      maxLength={passwordBounds.maxLen}
    />
  );
}
