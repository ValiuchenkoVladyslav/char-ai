import { waitUntil } from "@vercel/functions";

import type {
	Component,
	ComponentProps,
	ComponentType,
	SvelteComponent,
} from "svelte";
import { render } from "svelte/server";

import { RESEND_API } from "$env/static/private";

/** send email without execution blocking */
export function sendEmail<
	// biome-ignore lint/suspicious/noExplicitAny: exact type needed
	Comp extends Component<any>,
>(
	to: string | string[],
	subject: string,
	// biome-ignore lint/suspicious/noExplicitAny: exact type needed
	template: Comp extends SvelteComponent<any> ? ComponentType<Comp> : Comp,
	templateProps: ComponentProps<Comp>,
) {
	async function renderAndSendTask() {
		const output = render(template, { props: templateProps });

		try {
			const res = await fetch("https://api.resend.com/emails", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${RESEND_API}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					from: "Char Ai <onboarding@resend.dev>",
					to: Array.isArray(to) ? to : [to],
					subject,
					html: output.body,
				}),
			});

			if (!res.ok) {
				console.error("FAILED TO SEND EMAIL:", res.statusText, res.text());
			}
		} catch (e) {
			console.error("FAILED TO SEND EMAIL:", e);
		}
	}

	waitUntil(renderAndSendTask());
}
