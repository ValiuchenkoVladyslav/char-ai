// testing showed that server hooks run on both nodejs and edge
// looks like it's just a thin wrapper around actual code

import { isUserBanned } from "$lib/server/bans";
import { getToken, verifyToken } from "$lib/server/jwt";
import { type Handle, redirect } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const path = event.url.pathname;

	// https://chromium.googlesource.com/devtools/devtools-frontend/+/main/docs/ecosystem/automatic_workspace_folders.md
	// biome-ignore lint/correctness/noUnusedLabels: see vite.config.ts
	// biome-ignore lint/suspicious/noConfusingLabels: see vite.config.ts
	DEV: if (path === "/.well-known/appspecific/com.chrome.devtools.json") {
		return new Response(null, { status: 204 });
	}

	const token = getToken(event.cookies); // cheap

	if (event.route.id?.startsWith("/(protected)")) {
		const user = token && (await verifyToken(token));

		if (!user) {
			throw redirect(302, "/auth/sign-in");
		}

		if (await isUserBanned(user.sub)) {
			throw redirect(302, "/user-banned");
		}

		// set user in locals for all protected routes
		event.locals.user = user.sub;
	} else if (path.startsWith("/auth")) {
		const user = token && (await verifyToken(token));

		if (user) {
			if (await isUserBanned(user.sub)) {
				throw redirect(302, "/user-banned");
			}

			event.locals.user = user.sub;

			// if user is logged in, tries to access auth page:
			if (!path.startsWith("/auth/success")) {
				throw redirect(302, "/discover");
			}
		} else if (path === "/auth/success") {
			// if user is not logged in, tries to access auth success page:
			throw redirect(302, "/auth/sign-in");
		}
	} else if (path === "/user-banned") {
		// not banned and not logged in users should not see this page

		const user = token && (await verifyToken(token));

		if (!user) {
			throw redirect(302, "/auth/sign-in");
		}

		if (!(await isUserBanned(user.sub))) {
			throw redirect(302, "/discover");
		}
	}

	return resolve(event);
};
