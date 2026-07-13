import { env } from "@/lib/env";
import { Resend } from "resend";

interface ContactEmailPayload {
  name: string;
  email: string;
  message: string;
}

/**
 * Whether Resend is fully configured. All three values are required to send.
 */
const emailConfig =
  env.RESEND_API_KEY && env.RESEND_FROM_EMAIL && env.CONTACT_RECIPIENT_EMAIL
    ? {
        apiKey: env.RESEND_API_KEY,
        from: env.RESEND_FROM_EMAIL,
        to: env.CONTACT_RECIPIENT_EMAIL,
      }
    : null;

const resend = emailConfig ? new Resend(emailConfig.apiKey) : null;

/**
 * Send a contact-form message via Resend.
 *
 * When Resend is not configured (local/CI/fresh clones), the payload is logged
 * to the server console and the function resolves without sending — so the
 * contact flow works end-to-end without credentials. Real credentials in
 * production deliver the email; a Resend API error throws.
 */
export async function sendContactEmail(payload: ContactEmailPayload): Promise<void> {
  if (!resend || !emailConfig) {
    console.info("[Contact] Email not configured — logging payload instead:", payload);
    return;
  }

  const { error } = await resend.emails.send({
    from: emailConfig.from,
    to: emailConfig.to,
    replyTo: payload.email,
    subject: `[Portfolio Contact] Message from ${payload.name}`,
    text: `
Name: ${payload.name}
Email: ${payload.email}

Message:
${payload.message}
    `.trim(),
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}
