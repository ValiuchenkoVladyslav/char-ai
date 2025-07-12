declare global {
  /** autocomplete for `localStorage` */
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
}

export {};
