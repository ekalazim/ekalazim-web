# Pattern: Server Actions

Reference this file before building any form submission or mutation.

---

## When to Use Server Actions

Server Actions are the default for all form submissions and mutations.
Use API routes only for webhooks or third-party integrations.

```
Form submission      → Server Action ✅
Contact form         → Server Action ✅
Notion webhook       → API route (route.ts) ✅
External webhook     → API route (route.ts) ✅
```

---

## ActionResult Type

All Server Actions return a consistent typed result.
Never return raw data without wrapping in ActionResult.

```ts
// src/types/actions.ts

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }
```

This discriminated union forces the caller to handle both cases.
The compiler will error if you only handle the success case.

---

## Server Action Structure

```ts
// src/actions/contact.ts
"use server"

import { z } from "zod"
import { headers } from "next/headers"
import { sendContactEmail } from "@/lib/email"
import { checkRateLimit } from "@/lib/rate-limit"
import type { ActionResult } from "@/types/actions"

// 1. Zod schema — single source of truth for validation
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
  honeypot: z.string().max(0, "Bot detected"), // must be empty
})

export type ContactFormData = z.infer<typeof contactSchema>

// 2. Server Action function
export async function sendContactMessage(
  formData: ContactFormData
): Promise<ActionResult> {
  // Step 1: Validate input
  const parsed = contactSchema.safeParse(formData)
  if (!parsed.success) {
    return {
      success: false,
      error: "Please check your input.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  // Step 2: Honeypot check (bot rejection)
  if (parsed.data.honeypot !== "") {
    // Return success to not reveal the check to bots
    return { success: true, data: undefined }
  }

  // Step 3: Rate limiting
  const headersList = await headers()
  const ip = headersList.get("x-forwarded-for") ?? "unknown"
  const rateLimitResult = await checkRateLimit(ip)

  if (!rateLimitResult.allowed) {
    return {
      success: false,
      error: "Too many messages. Please try again in an hour.",
    }
  }

  // Step 4: Send email
  try {
    await sendContactEmail({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    })

    return { success: true, data: undefined }
  } catch (error) {
    console.error("[Contact] Email send failed:", error)
    return {
      success: false,
      error: "Failed to send message. Please try again or email me directly.",
    }
  }
}
```

---

## Consuming a Server Action in a Client Component

```tsx
// src/components/shared/ContactForm.tsx

// "use client" required — uses useState, RHF hooks, event handlers
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { sendContactMessage, type ContactFormData } from "@/actions/contact"

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string>("")

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  async function onSubmit(data: ContactFormData) {
    setStatus("loading")

    const result = await sendContactMessage(data)

    if (result.success) {
      setStatus("success")
      reset()
    } else {
      setStatus("error")
      setErrorMessage(result.error)
    }
  }

  if (status === "success") {
    return (
      <div role="alert" aria-live="polite">
        <p className="text-success">Message sent! I'll get back to you soon.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Honeypot — visually hidden, must be empty */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("honeypot")}
        />
      </div>

      {/* Name field */}
      <div>
        <label htmlFor="name" className="text-sm font-medium text-secondary">
          Name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          className="input-base"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
        />
        {errors.name && (
          <p id="name-error" role="alert" className="text-sm text-error mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* ... email and message fields follow same pattern ... */}

      {status === "error" && (
        <p role="alert" className="text-error text-sm">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary"
        aria-disabled={status === "loading"}
      >
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
    </form>
  )
}
```

---

## Rate Limiting Pattern

```ts
// src/lib/rate-limit.ts

import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { env } from "@/lib/env"

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN,
})

// 3 requests per hour per IP
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  prefix: "portfolio:contact",
})

export async function checkRateLimit(
  identifier: string
): Promise<{ allowed: boolean; remaining: number }> {
  const { success, remaining } = await ratelimit.limit(identifier)
  return { allowed: success, remaining }
}
```

---

## Email Sending Pattern

```ts
// src/lib/email.ts

import { Resend } from "resend"
import { env } from "@/lib/env"

const resend = new Resend(env.RESEND_API_KEY)

interface ContactEmailPayload {
  name: string
  email: string
  message: string
}

export async function sendContactEmail(payload: ContactEmailPayload): Promise<void> {
  const { error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: env.CONTACT_RECIPIENT_EMAIL,
    subject: `[Portfolio Contact] Message from ${payload.name}`,
    text: `
Name: ${payload.name}
Email: ${payload.email}

Message:
${payload.message}
    `.trim(),
  })

  if (error) {
    throw new Error(`Resend error: ${error.message}`)
  }
}
```

---

## Validation Rules

1. **Always validate on the server.** Client-side validation (RHF + Zod) is
   for UX only — never rely on it for security.

2. **Share the schema.** Use `z.infer<typeof schema>` so the client and server
   share the exact same type. No duplication.

3. **Return fieldErrors for form field highlighting.**
   The `fieldErrors` key maps field names to arrays of error messages,
   matching RHF's `setError` API.

4. **Never return sensitive information in error messages.**
   "Email send failed" — not "SMTP connection refused on port 587".
