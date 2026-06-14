"use client";

import { FormEvent, useState } from "react";
import { useFormspree } from "./useFormspree";
import { ActionButton } from "@/components/ui/Button";
import { TextField, TextArea, FormError, SuccessMessage } from "./fields";

const AMOUNTS = ["$25", "$50", "$100", "$250", "$500", "Other"];

export default function DonateForm() {
  const { status, submit } = useFormspree();
  const [amount, setAmount] = useState<string>("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await submit({
      name: data.get("name"),
      email: data.get("email"),
      amount: amount === "Other" ? data.get("customAmount") : amount,
      message: data.get("message"),
      _subject: "HCT — Donation intent",
      form: "donate",
    });
  }

  if (status === "success") {
    return (
      <SuccessMessage message="Thank you. We'll be in touch soon to complete your gift." />
    );
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

      <fieldset>
        <legend className="font-body text-sm tracking-wider text-hct-silver mb-4">
          Donation Amount
        </legend>
        <div className="flex flex-wrap gap-3">
          {AMOUNTS.map((amt) => {
            const selected = amount === amt;
            return (
              <label
                key={amt}
                className={`cursor-pointer font-body text-sm tracking-wider px-6 py-3 rounded-sm border transition-colors ${
                  selected
                    ? "bg-hct-silver text-hct-velvet border-hct-silver"
                    : "border-hct-silver/30 text-hct-silver hover:border-hct-silver/60"
                }`}
              >
                <input
                  type="radio"
                  name="amount"
                  value={amt}
                  checked={selected}
                  onChange={() => setAmount(amt)}
                  disabled={submitting}
                  className="sr-only"
                />
                {amt}
              </label>
            );
          })}
        </div>
      </fieldset>

      {amount === "Other" && (
        <TextField
          label="Custom Amount"
          name="customAmount"
          disabled={submitting}
          placeholder="$"
        />
      )}

      <TextArea
        label="What inspired your gift?"
        name="message"
        optional
        disabled={submitting}
      />

      <div className="pt-2">
        <ActionButton type="submit" variant="donate" disabled={submitting}>
          {submitting ? "Sending…" : "Make My Donation"}
        </ActionButton>
      </div>

      <p className="text-sm text-hct-mist/60 font-body font-light leading-relaxed">
        HCT will contact you to process your donation securely. We do not store
        payment information.
      </p>
      <p className="text-xs text-hct-silver/40 font-body">
        Hillsboro Civic Theater is a registered 501(c)(3) nonprofit. EIN:
        PENDING.
      </p>

      {status === "error" && <FormError />}
    </form>
  );
}
