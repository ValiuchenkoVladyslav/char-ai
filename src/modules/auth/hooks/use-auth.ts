import { useLayoutEffect, useSyncExternalStore } from "react";
import { getMe } from "~/modules/auth/actions/get-me";

type AuthResponse = Awaited<ReturnType<typeof getMe>>;

type AuthState =
  | { user: null; error: null; loading: true }
  | { user: AuthResponse; error: null; loading: false }
  | { user: null; error: Error; loading: false };

type Listener = () => void;

let state: AuthState = {
  user: null,
  error: null,
  loading: true,
};

const listeners = new Set<Listener>();

function getAuth(): AuthState {
  return state;
}

/** set auth state without subscription */
export function setAuth(newState: AuthState) {
  state = newState;
  listeners.forEach((listener) => listener());
}

/** set auth state user without subscription */
export function setUser(user: AuthResponse) {
  setAuth({ user, error: null, loading: false });
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// start fetching during render & on first import
const reqPromise = typeof window === "undefined" ? null : getMe();
let stateSettersAttached = false;

/** fetch auth or reuse from cache */
export function useAuth(): AuthState {
  const auth = useSyncExternalStore(subscribe, getAuth, getAuth);

  // attach state setters only after render is complete
  useLayoutEffect(() => {
    if (!reqPromise || stateSettersAttached) return;

    reqPromise.then(setUser).catch((error) => {
      setAuth({ user: null, error, loading: false });
    });

    stateSettersAttached = true;
  }, []);

  return auth;
}
