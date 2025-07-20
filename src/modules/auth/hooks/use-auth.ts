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

let initial = true;

function getMeAndSetUser() {
  getMe()
    .then(setUser)
    .catch((error) => {
      setAuth({ user: null, error, loading: false });
    });
}

let wasVisible = false; // for some reason visibilitychange triggers twice with same state

function onVisible() {
  if (document.hidden) {
    wasVisible = true;
  }

  if (wasVisible && !document.hidden) {
    getMeAndSetUser();
    wasVisible = false;
  }
}

/** fetch auth or reuse from cache */
export function useAuth(): AuthState {
  const auth = useSyncExternalStore(subscribe, getAuth, getAuth);

  useLayoutEffect(() => {
    if (!initial) return;

    getMeAndSetUser();

    initial = false;
  }, []);

  useLayoutEffect(() => {
    window.addEventListener("visibilitychange", onVisible);

    return () => window.removeEventListener("visibilitychange", onVisible);
  }, []);

  return auth;
}
