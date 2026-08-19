// "use client" required — uses useState, React Hook Form hooks, and an
// onSubmit event handler.
"use client";

import { sendContactMessage } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { type ContactFormData, contactSchema } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

type Status = "idle" | "loading" | "success" | "error";

const inputClass = cn(
  "mt-1.5 block w-full rounded-sm border border-border bg-bg-base px-3 py-2.5",
  "text-text-primary placeholder:text-text-muted transition-colors duration-150",
  "focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
  "aria-[invalid=true]:border-error aria-[invalid=true]:focus-visible:ring-error",
);

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    setStatus("loading");

    const result = await sendContactMessage(data);

    if (result.success) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
      setErrorMessage(result.error);
    }
  }

  if (status === "success") {
    return (
      <div role="alert" aria-live="polite" className="rounded-md border border-success/40 bg-success/10 p-4">
        <p className="font-medium text-success">Message sent!</p>
        <p className="mt-1 text-sm text-text-secondary">
          Thanks for reaching out — I&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Honeypot — visually hidden, must stay empty. Bots that fill it are
          silently accepted (fake success) on the server. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company (leave blank)</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("honeypot")} />
      </div>

      <div>
        <label htmlFor="name" className="text-sm font-medium text-text-secondary">
          Name
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          className={inputClass}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
        />
        {errors.name && (
          <p id="name-error" role="alert" className="mt-1 text-sm text-error">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="text-sm font-medium text-text-secondary">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={inputClass}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1 text-sm text-error">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="text-sm font-medium text-text-secondary">
          Message
        </label>
        <textarea
          id="message"
          rows={6}
          className={cn(inputClass, "resize-y")}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
        />
        {errors.message && (
          <p id="message-error" role="alert" className="mt-1 text-sm text-error">
            {errors.message.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-error">
          {errorMessage}
        </p>
      )}

      <Button type="submit" disabled={status === "loading"} aria-disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
