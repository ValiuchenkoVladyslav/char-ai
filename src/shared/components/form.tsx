"use client";

import NextForm from "next/form";
import { createContext, use, useEffect, useState } from "react";

namespace Form {
  export interface Props extends Omit<PropsOf<typeof NextForm>, "ref"> {}

  export interface Context {
    form: HTMLFormElement | null;
  }
}

const FormContext = createContext<Form.Context>({
  form: null,
});

/** get form ref */
export function useForm() {
  return use(FormContext).form;
}

/** prevent form submit */
export function usePreventSubmit(prevent: boolean) {
  const form = useForm();

  useEffect(() => {
    function preventSubmit(evt: Event) {
      if (!prevent) return;

      evt.preventDefault();
      evt.stopPropagation();
    }

    form?.addEventListener("submit", preventSubmit);

    return () => {
      form?.removeEventListener("submit", preventSubmit);
    };
  }, [prevent, form]);
}

function watchReset(evt: Event) {
  evt.preventDefault();
}

/**
 * - prevents reset on submit
 * - ref is exposed via `useForm`
 */
export function Form(props: Form.Props) {
  const [form, setForm] = useState<HTMLFormElement | null>(null);

  return (
    <FormContext value={{ form }}>
      <NextForm
        {...props}
        ref={(form) => {
          setForm(form);
          form?.addEventListener("reset", watchReset);

          return () => {
            form?.removeEventListener("reset", watchReset);
          };
        }}
      />
    </FormContext>
  );
}
