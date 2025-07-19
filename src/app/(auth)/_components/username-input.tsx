"use client";

import { LoaderCircle } from "lucide-react";
import { useRef, useState } from "react";

import { isUsernameTaken, usernameBounds } from "~/modules/user/client";
import { usePreventSubmit } from "~/shared/components/form";
import { Input } from "~/shared/components/input";

enum CheckStatus {
  Checking,
  Taken,
  Available,
}

export function UsernameInput() {
  const checkTimeoutId = useRef<NodeJS.Timeout | null>(null);
  const [isTaken, setTaken] = useState<CheckStatus>();

  // prevent form submit unless username is available
  usePreventSubmit(isTaken !== CheckStatus.Available);

  function checkUsernameTaken(evt: React.ChangeEvent<HTMLInputElement>) {
    if (checkTimeoutId.current) {
      clearTimeout(checkTimeoutId.current);
    }

    const username = evt.currentTarget.value;

    if (username.length < usernameBounds.minLen) {
      return setTaken(undefined);
    }

    setTaken(CheckStatus.Checking); // reset state before checking

    checkTimeoutId.current = setTimeout(() => {
      isUsernameTaken(username).then((res) => {
        setTaken(res ? CheckStatus.Taken : CheckStatus.Available);
      });
    }, 240);
  }

  return (
    <Input
      label={
        <div className="flex items-center gap-2">
          <span>Username</span>

          <span className="flex gap-0.5 items-center opacity-70">
            {isTaken === CheckStatus.Checking ? (
              <LoaderCircle className="animate-spin h-[0.7lh]" />
            ) : isTaken === CheckStatus.Taken ? (
              <span className="text-red-600">is taken!</span>
            ) : null}
          </span>
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
