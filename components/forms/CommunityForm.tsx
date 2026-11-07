"use client";

import ConsentFields from "./ConsentFields";
import { FormEvent } from "react";
import { useWebsiteForm } from "./useWebsiteForm";
import { ActionButton } from "@/components/ui/Button";
import {
  TextField,
  TextArea,
  CheckboxGroup,
  FormError,
  SuccessMessage,
} from "./fields";

import { INVOLVEMENT } from "@/lib/forms/schema.mjs";

export default function CommunityForm() {
  const { status, submit, error } = useWebsiteForm();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await submit({
      name: data.get("name"),
      newsletterConsent: data.get("newsletterConsent") === "on",
      website: data.get("website") || "",
      email: data.get("email"),
      cityZip: data.get("cityZip"),
      involvement: data.getAll("involvement"),
      about: data.get("about"),
      form: "community",
    });
  }

  if (status === "success") {
    return <SuccessMessage />;
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={onSubmit} className="space-y-8 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <TextField label="Name" name="name" required disabled={submitting} />
        <TextField
          label="Email"
          name="email"
          type="email"
          required
          disabled={submitting}
        />
      </div>
      <TextField
        label="City / Zip"
        name="cityZip"
        optional
        disabled={submitting}
      />
      <CheckboxGroup
        label="How would you like to be involved?"
        name="involvement"
        options={INVOLVEMENT}
        disabled={submitting}
      />
      <TextArea
        label="Tell us a little about yourself"
        name="about"
        optional
        disabled={submitting}
      />
      <ConsentFields disabled={submitting} />
      <div className="pt-2">
        <ActionButton type="submit" disabled={submitting}>
          {submitting ? "Sending…" : "Join the Community"}
        </ActionButton>
      </div>
      {status === "error" && <FormError message={error} />}
    </form>
  );
}
