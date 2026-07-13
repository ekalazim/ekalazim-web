import { z } from "zod";

/**
 * Contact-form validation schema — the single source of truth shared by the
 * client (`ContactForm` via `zodResolver`) and the server (`sendContactMessage`).
 *
 * Lives in its own module (not the `"use server"` action file) because a
 * `"use server"` module may only export async functions — exporting a runtime
 * value like a Zod schema from it breaks the client bundle.
 *
 * `honeypot` is intentionally unconstrained: a filled honeypot is handled
 * separately (returns a fake success) so bots never learn the field is a trap.
 */
export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  honeypot: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
