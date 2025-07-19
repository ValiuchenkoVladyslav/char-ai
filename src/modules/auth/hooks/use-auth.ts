import { useSyncExternalStore } from "react";
import type { AuthData } from "~/modules/auth/lib/base";

type AuthState = AuthData | null | undefined;
type Listener = () => void;

let state: AuthState;
const listeners = new Set<Listener>();

function getAuth(): AuthState {
  return state;
}

export function setAuth(updater: AuthState | ((prev: AuthState) => AuthState)) {
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
