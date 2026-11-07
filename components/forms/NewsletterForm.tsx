"use client";

import ConsentFields from "./ConsentFields";
import { FormEvent } from "react";
import { useWebsiteForm } from "./useWebsiteForm";
import { ActionButton } from "@/components/ui/Button";
import { FormError } from "./fields";

export default function NewsletterForm() {
  const { status, submit, error } = useWebsiteForm();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await submit({
      newsletterConsent: form.get("newsletterConsent") === "on",
      website: form.get("website") || "",
      email: form.get("email"),
      form: "newsletter",
    });
  }

  if (status === "success") {
    return (
      <p className="font-accent italic text-xl text-hct-spotlight">
        Your newsletter signup is saved. Thank you.
      </p>
    );
  }

  const submitting = status === "submitting";

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col items-stretch gap-4 max-w-xl"
    >
      <input
        type="email"
        name="email"
        maxLength={254}
        required
        disabled={submitting}
        placeholder="Your email address"
        aria-label="Your email address"
        className="flex-1 bg-transparent border-b border-hct-silver/60 text-hct-cloud placeholder:text-hct-silver focus:border-hct-silver outline-none py-3 font-body text-base font-light transition-colors disabled:opacity-50"
      />
      <ConsentFields disabled={submitting} required />
      <ActionButton type="submit" disabled={submitting} className="shrink-0">
        {submitting ? "Sending…" : "Stay Connected"}
      </ActionButton>
      {status === "error" && (
        <div className="">
          <FormError message={error} />
        </div>
      )}
    </form>
  );
}
