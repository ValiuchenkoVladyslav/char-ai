// testing showed that server hooks run on both nodejs and edge
// looks like it's just a thin wrapper around actual code

import { isUserBanned } from "$lib/server/bans";
import { getToken, verifyToken } from "$lib/server/jwt";
import { redirect } from "@sveltejs/kit";

import type { RouteId as UserBannedRouteId } from "./routes/(with-footer)/user-banned/$types";
import type { RouteId as AuthRouteId } from "./routes/auth/$types";

export async function handle({ event, resolve }) {
  const route = event.route.id;
  const authToken = getToken(event.cookies);

  const user = authToken && (await verifyToken(authToken));
  event.locals.user = user ? user.sub : undefined;

  // https://chromium.googlesource.com/devtools/devtools-frontend/+/main/docs/ecosystem/automatic_workspace_folders.md
  // biome-ignore lint/correctness/noUnusedLabels: see vite.config.ts
  // biome-ignore lint/suspicious/noConfusingLabels: see vite.config.ts
  DEV: if (event.url.pathname.includes("com.chrome.devtools.json")) {
    return new Response(null, { status: 204 });
  }

  // redirect unauthenticated users off protected routes
  if (route?.includes("(protected)")) {
    if (!user) {
      redirect(302, "/auth/sign-in");
    } else if (await isUserBanned(user.sub)) {
      redirect(302, "/user-banned");
    }

    return resolve(event);
  }

  // redirect authenticated users off auth routes
  if (route?.startsWith("/auth" satisfies AuthRouteId)) {
    if (user) {
      if (await isUserBanned(user.sub)) {
        redirect(302, "/user-banned");
      }

      // if user is logged in, tries to access auth (not api) pages:
      if (route !== "/auth/success" && !route?.startsWith("/auth/(api)")) {
        redirect(302, "/discover");
      }
    } else if (route === "/auth/success") {
      // if user is not logged in, tries to access auth success page:
      redirect(302, "/auth/sign-in");
    }

    return resolve(event);
  }

  // redirect not banned and not authenticated users off user-banned page
  if (route === ("/(with-footer)/user-banned" satisfies UserBannedRouteId)) {
    if (!user) {
      redirect(302, "/auth/sign-in");
    }

    if (!(await isUserBanned(user.sub))) {
      redirect(302, "/discover");
    }

    return resolve(event);
  }

  return resolve(event);
}
