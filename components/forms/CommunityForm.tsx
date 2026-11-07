"use client";

import { FormEvent } from "react";
import { useFormspree } from "./useFormspree";
import { ActionButton } from "@/components/ui/Button";
import {
  TextField,
  TextArea,
  CheckboxGroup,
  FormError,
  SuccessMessage,
} from "./fields";

const INVOLVEMENT = [
  "Performer (singer/actor/dancer)",
  "Musician / Orchestra",
  "Director / Choreographer / Music Director",
  "Production / Crew / Design",
  "Volunteer",
  "Audience Member / Supporter",
];

export default function CommunityForm() {
  const { status, submit } = useFormspree();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await submit({
      name: data.get("name"),
      email: data.get("email"),
      cityZip: data.get("cityZip"),
      involvement: data.getAll("involvement"),
      about: data.get("about"),
      _subject: "HCT: Community interest submission",
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
      <div className="pt-2">
        <ActionButton type="submit" disabled={submitting}>
          {submitting ? "Sending…" : "Join the Community"}
        </ActionButton>
      </div>
      {status === "error" && <FormError />}
    </form>
  );
}
