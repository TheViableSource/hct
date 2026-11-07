"use client";

import ConsentFields from "./ConsentFields";
import { FormEvent } from "react";
import { useWebsiteForm } from "./useWebsiteForm";
import { ActionButton } from "@/components/ui/Button";
import {
  TextField,
  TextArea,
  CheckboxGroup,
  SelectField,
  FormError,
  SuccessMessage,
} from "./fields";

import { INTENTS, SPONSOR_LEVELS } from "@/lib/forms/schema.mjs";

export default function MasterForm() {
  const { status, submit, error } = useWebsiteForm();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await submit({
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      newsletterConsent: data.get("newsletterConsent") === "on",
      website: data.get("website") || "",
      email: data.get("email"),
      phone: data.get("phone"),
      organization: data.get("organization"),
      intent: data.getAll("intent"),
      sponsorLevel: data.get("sponsorLevel") || "",
      about: data.get("about"),
      form: "get-involved",
    });
  }

  if (status === "success") {
    return <SuccessMessage />;
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={onSubmit} className="space-y-8 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <TextField
          label="First Name"
          name="firstName"
          required
          disabled={submitting}
        />
        <TextField
          label="Last Name"
          name="lastName"
          required
          disabled={submitting}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <TextField
          label="Email"
          name="email"
          type="email"
          required
          disabled={submitting}
        />
        <TextField
          label="Phone"
          name="phone"
          type="tel"
          optional
          disabled={submitting}
        />
      </div>
      <TextField
        label="Organization / Business"
        name="organization"
        optional
        disabled={submitting}
      />
      <CheckboxGroup
        label="I want to:"
        name="intent"
        options={INTENTS}
        disabled={submitting}
      />
      <SelectField
        label="Which sponsor level interests you?"
        name="sponsorLevel"
        options={SPONSOR_LEVELS}
        disabled={submitting}
      />
      <TextArea
        label="Tell us about yourself and how you want to help"
        name="about"
        optional
        disabled={submitting}
      />
      <ConsentFields disabled={submitting} />
      <div className="pt-2">
        <ActionButton type="submit" disabled={submitting}>
          {submitting ? "Sending…" : "Let's Talk"}
        </ActionButton>
      </div>
      <p className="text-xs text-hct-silver font-body leading-relaxed">
        We&apos;ll be in touch soon. Each message matters to us. We reply to every person.
      </p>
      {status === "error" && <FormError message={error} />}
    </form>
  );
}
