"use client";

import { LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";
import { isUsernameTaken, usernameBounds } from "~/modules/user/client";
import { usePreventSubmit } from "~/shared/components/form";
import { Input } from "~/shared/components/input";

export function UsernameInput() {
  const checkTimeoutId = useRef<NodeJS.Timeout | null>(null);
  const [isTaken, setTaken] = useState<boolean | null | undefined>(undefined);

  usePreventSubmit(isTaken !== false); // prevent submit unless username is available

  function checkUsernameTaken(evt: React.ChangeEvent<HTMLInputElement>) {
    if (checkTimeoutId.current) {
      clearTimeout(checkTimeoutId.current);
    }

    const username = evt.currentTarget.value;

    if (username.length < usernameBounds.minLen) {
      return setTaken(undefined);
    }

    setTaken(null); // reset state before checking

    checkTimeoutId.current = setTimeout(() => {
      isUsernameTaken(username).then(setTaken);
    }, 160);
  }

  return (
    <Input
      label="Username"
      status={
        <div className="text-sm font-semibold h-[1lh] flex gap-1 items-center opacity-70">
          <LoaderCircle
            className={`animate-spin h-[0.8lh] ${isTaken === null ? "" : "hidden"}`}
          />
          {isTaken === null ? "Checking..." : null}
          {isTaken === true ? (
            <span className="text-red-600">Username is taken!</span>
          ) : null}
        </div>
      }
      type="text"
      name="username"
      placeholder="@username"
      minLength={usernameBounds.minLen}
      maxLength={usernameBounds.maxLen}
      onChange={checkUsernameTaken}
    />
  );
}
