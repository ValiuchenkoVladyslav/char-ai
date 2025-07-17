"use client";

import NextForm from "next/form";
import { createContext, use, useEffect, useRef } from "react";

namespace Form {
  export interface Props extends PropsOf<typeof NextForm> {}

  export interface Context {
    addBlocker: (fn: () => boolean) => void;
    removeBlocker: (fn: () => boolean) => void;
  }
}

const FormContext = createContext<Form.Context>({
  addBlocker: () => {},
  removeBlocker: () => {},
});

function _Form({ onSubmit, ...props }: Form.Props) {
  const blockers = useRef(new Set<() => boolean>());
  const form = useRef<HTMLFormElement>(null);

  function addBlocker(fn: () => boolean) {
    blockers.current.add(fn);
  }

  function removeBlocker(fn: () => boolean) {
    blockers.current.delete(fn);
  }

  function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    for (const blocker of blockers.current) {
      if (blocker()) {
        return evt.preventDefault();
      }
    }

    onSubmit?.(evt);
  }

  useEffect(() => {
    function watchReset(e: Event) {
      e.preventDefault();
    }

    const formElem = form.current;
    formElem?.addEventListener("reset", watchReset);

    return () => {
      formElem?.removeEventListener("reset", watchReset);
    };
  }, []);

  return (
    <FormContext value={{ addBlocker, removeBlocker }}>
      <NextForm {...props} ref={form} onSubmit={handleSubmit} />
    </FormContext>
  );
}

/**
 * form that can be blocked via `usePreventSubmit`
 * also prevents reset on submit
 */
export function Form(props: Form.Props) {
  return <_Form {...props} />;
}

export function usePreventSubmit(preventSubmit: boolean) {
  const { addBlocker, removeBlocker } = use(FormContext);
  const fnRef = useRef(() => preventSubmit);
  fnRef.current = () => preventSubmit;

  useEffect(() => {
    const blocker = () => fnRef.current();
    addBlocker(blocker);

    return () => removeBlocker(blocker);
  }, [addBlocker, removeBlocker]);
}
