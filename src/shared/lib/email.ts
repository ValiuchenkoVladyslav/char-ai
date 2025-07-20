import "~/shared/lib/server-only";

import { after } from "next/server";

export function sendEmail(
  to: string | string[],
  subject: string,
  html: string,
) {
  const req = fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Char Ai <onboarding@resend.dev>",
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    }),
  });

  // we don't want to block each request execution until email is sent,
  // - errors here are considered as edge cases, so we log them at least
  //   after response is sent
  // - we also ensure serverless function not dies until request is finished
  after(async () => {
    try {
      const res = await req;

      if (!res.ok) {
        console.error(
          "FAILED TO SEND EMAIL:",
          res.statusText,
          await res.text(),
        );
      }
    } catch (e) {
      console.error("FAILED TO SEND EMAIL:", e);
    }
  });
}
