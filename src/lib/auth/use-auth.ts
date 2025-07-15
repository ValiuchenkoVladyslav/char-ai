import { useSyncExternalStore } from "react";

type Auth = {
  // todo
  userId?: string;
  username?: string;
  email?: string;
};

type AuthState = Auth | null;
type Listener = () => void;

let state: AuthState = null;
const listeners = new Set<Listener>();

function getAuth(): AuthState {
  return state;
}

function setAuth(
  updater: Partial<AuthState> | ((prev: AuthState) => Partial<AuthState>),
) {
  const patch = typeof updater === "function" ? updater(state) : updater;

  if (state) {
    state = { ...state, ...patch };
  } else {
    state = patch;
  }

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
