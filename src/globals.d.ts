declare global {
  // === envs (checked in src/instrumentation.ts) ===

  namespace NodeJS {
    interface ProcessEnv {
      DB_URL: string;
      REDIS_URL: string;
      REDIS_TOKEN: string;
      JWT_SECRET_ENCODE: string;
      JWT_SECRET_DECODE: string;
    }
  }

  // === autocomplete for localStorage ===

  interface StorageKVs {
    theme: "dark" | "light";
  }

  interface Storage {
    getItem<Key extends keyof StorageKVs>(key: Key): StorageKVs[Key] | null;
    setItem<Key extends keyof StorageKVs>(
      key: Key,
      value: StorageKVs[Key],
    ): void;
    removeItem<Key extends keyof StorageKVs>(key: Key): void;
  }

  // === react shortcuts ===

  /** almost an alias to `React.PropsWithChildren`; better types */
  type WithChildren<P extends object = object> = React.PropsWithChildren<P>;

  /** get component or jsx element props */
  type PropsOf<
    T extends
      | keyof React.JSX.IntrinsicElements
      // biome-ignore lint/suspicious/noExplicitAny: follow original type
      | React.JSXElementConstructor<any>,
  > = React.ComponentProps<T>;
}

export {};
