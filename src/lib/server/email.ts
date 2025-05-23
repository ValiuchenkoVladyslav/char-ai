import { waitUntil } from "@vercel/functions";
import { type CreateEmailOptions, Resend } from "resend";

import type {
	Component,
	ComponentProps,
	ComponentType,
	SvelteComponent,
} from "svelte";
import { render } from "svelte/server";

import { RESEND_API } from "$env/static/private";

const resend = new Resend(RESEND_API);

/** send email without execution blocking */
export function sendEmail<
	// biome-ignore lint/suspicious/noExplicitAny: exact type needed
	Comp extends Component<any>,
>(
	to: CreateEmailOptions["to"],
	subject: CreateEmailOptions["subject"],
	// biome-ignore lint/suspicious/noExplicitAny: exact type needed
	template: Comp extends SvelteComponent<any> ? ComponentType<Comp> : Comp,
	templateProps: ComponentProps<Comp>,
) {
	async function renderAndSendTask() {
		const output = render(template, { props: templateProps });

		const res = await resend.emails.send({
			from: "Char Ai <onboarding@resend.dev>",
			to,
			subject,
			html: output.body,
		});

		if (res.error) {
			console.error("FAILED TO SEND EMAIL:", res.error);
		}
	}

	waitUntil(renderAndSendTask());
}
