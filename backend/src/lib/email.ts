const emailHeaders = {
  Authorization: `Bearer ${process.env.RESEND_KEY}`,
  "Content-Type": "application/json",
};

export async function sendEmail(
  to: string | string[],
  subject: string,
  html: string,
) {
  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: emailHeaders,
    body: JSON.stringify({
      from: process.env.RESEND_EMAIL_FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    }),
  });
}
