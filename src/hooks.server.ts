// testing showed that server hooks run on both nodejs and edge
// looks like it's just a thin wrapper around actual code

import { redirect, type Handle } from "@sveltejs/kit";
import { getToken, verifyToken } from "$lib/server/jwt";
import { isUserBanned } from "$lib/server/db/bans";

export const handle: Handle = async ({ event, resolve }) => {
  const token = getToken(event.cookies); // cheap

  if (event.route.id?.startsWith("/(protected)")) {
    const user = token && await verifyToken(token);

    if (!user) {
      throw redirect(302, "/auth/sign-in");
    }

    if (await isUserBanned(user.sub)) {
      throw redirect(302, "/user-banned");
    }

    // set user in locals for all protected routes
    event.locals.user = user.sub;
  } else if (event.url.pathname.startsWith("/auth")) {
    const user = token && await verifyToken(token);

    if (user) {
      if (await isUserBanned(user.sub)) {
        throw redirect(302, "/user-banned");
      }

      event.locals.user = user.sub;

      throw redirect(302, "/discover");
    }
  } else if (event.url.pathname === "/user-banned") {
    const user = token && await verifyToken(token);

    if (!user) {
      throw redirect(302, "/auth/sign-in");
    }

    if (!(await isUserBanned(user.sub))) {
      throw redirect(302, "/discover");
    }
  }

  return resolve(event);
};
