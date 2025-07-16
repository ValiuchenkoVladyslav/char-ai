"use client";

import { useId } from "react";

namespace Input {
  export interface Props extends Omit<PropsOf<"input">, "id"> {
    label: React.ReactNode;
    status?: React.ReactNode;
  }
}

export function Input({ label, status, className, ...props }: Input.Props) {
  const inputId = useId();

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="font-semibold">
        Username
      </label>
      <input
        id={inputId}
        required
        className={`input ${className}`}
        {...props}
      />

      {status}
    </div>
  );
}
