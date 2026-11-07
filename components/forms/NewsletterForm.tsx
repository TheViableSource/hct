"use client";

import { FormEvent } from "react";
import { useFormspree } from "./useFormspree";
import { ActionButton } from "@/components/ui/Button";
import { FormError } from "./fields";

export default function NewsletterForm() {
  const { status, submit } = useFormspree();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await submit({
      email: form.get("email"),
      _subject: "HCT: New newsletter signup",
      form: "newsletter",
    });
  }

  if (status === "success") {
    return (
      <p className="font-accent italic text-xl text-hct-spotlight">
        You&apos;re on the list. We&apos;ll be in touch.
      </p>
    );
  }

  const submitting = status === "submitting";

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 max-w-xl"
    >
      <input
        type="email"
        name="email"
        required
        disabled={submitting}
        placeholder="Your email address"
        aria-label="Your email address"
        className="flex-1 bg-transparent border-b border-hct-silver/60 text-hct-cloud placeholder:text-hct-silver focus:border-hct-silver outline-none py-3 font-body text-base font-light transition-colors disabled:opacity-50"
      />
      <ActionButton type="submit" disabled={submitting} className="shrink-0">
        {submitting ? "Sending…" : "Stay Connected"}
      </ActionButton>
      {status === "error" && (
        <div className="sm:absolute sm:mt-16">
          <FormError />
        </div>
      )}
    </form>
  );
}
