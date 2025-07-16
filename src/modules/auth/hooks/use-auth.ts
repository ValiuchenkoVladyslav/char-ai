import { useSyncExternalStore } from "react";

// todo
export interface Auth {
  userId: number;
  username: string;
  email: string;
}

type AuthState = Auth | null;
type Listener = () => void;

let state: AuthState = null;
const listeners = new Set<Listener>();

function getAuth(): AuthState {
  return state;
}

function setAuth(updater: AuthState | ((prev: AuthState) => AuthState)) {
  state = typeof updater === "function" ? updater(state) : updater;

  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAuth(): [AuthState, typeof setAuth] {
  const selected = useSyncExternalStore(subscribe, getAuth, getAuth);
  return [selected, setAuth];
}
