"use server";

import { type ContactFormData, contactSchema } from "@/lib/contact-schema";
import { sendContactEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import type { ActionResult } from "@/types/actions";
import { headers } from "next/headers";

export async function sendContactMessage(formData: ContactFormData): Promise<ActionResult> {
  // Step 1: Honeypot check. Return success to avoid revealing the trap to bots.
  if (formData.honeypot && formData.honeypot.length > 0) {
    return { success: true, data: undefined };
  }

  // Step 2: Validate input server-side (client validation is UX only).
  const parsed = contactSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check your input.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // Step 3: Rate limiting by client IP.
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") ?? "unknown";
  const rateLimitResult = await checkRateLimit(ip);

  if (!rateLimitResult.allowed) {
    return {
      success: false,
      error: "Too many messages. Please try again in an hour.",
    };
  }

  // Step 4: Send email.
  try {
    await sendContactEmail({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error("[Contact] Email send failed:", error);
    return {
      success: false,
      error: "Failed to send message. Please try again or email me directly.",
    };
  }
}
