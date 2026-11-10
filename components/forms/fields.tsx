"use client";
import { ContentText, useText } from "@/components/cms/ContentProvider";


import { ReactNode } from "react";
import { motion } from "framer-motion";

const inputBase =
  "w-full bg-transparent border-b border-hct-silver/60 text-hct-cloud placeholder:text-hct-silver focus:border-hct-silver outline-none py-3 font-body text-base font-light transition-colors disabled:opacity-50";

export function FieldLabel({
  children,
  htmlFor,
  optional,
}: {
  children: ReactNode;
  htmlFor?: string;
  optional?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block font-body text-sm tracking-wider text-hct-silver mb-2"
    >
      <ContentText>{children}</ContentText>
      {optional && (
        <span className="text-hct-silver ml-2 normal-case tracking-normal text-xs">
          <ContentText>(optional)</ContentText>
        </span>
      )}
    </label>
  );
}

export function TextField({
  label,
  name,
  type = "text",
  required,
  optional,
  placeholder,
  disabled,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
  placeholder?: string;
  disabled?: boolean;
}) {
  const translate=useText();
  return (
    <div>
      <FieldLabel htmlFor={name} optional={optional}>
        <ContentText>{label}</ContentText>
      </FieldLabel>
      <input
        id={name}
        name={name}
        type={type}
        maxLength={type === "email" ? 254 : 200}
        required={required}
        disabled={disabled}
        placeholder={translate(placeholder)}
        className={inputBase}
      />
    </div>
  );
}

export function TextArea({
  label,
  name,
  optional,
  disabled,
  placeholder,
}: {
  label: string;
  name: string;
  optional?: boolean;
  disabled?: boolean;
  placeholder?: string;
}) {
  const translate=useText();
  return (
    <div>
      <FieldLabel htmlFor={name} optional={optional}>
        <ContentText>{label}</ContentText>
      </FieldLabel>
      <textarea
        maxLength={4000}
        id={name}
        name={name}
        rows={4}
        disabled={disabled}
        placeholder={translate(placeholder)}
        className={`${inputBase} resize-none`}
      />
    </div>
  );
}

export function CheckboxGroup({
  label,
  name,
  options,
  disabled,
}: {
  label: string;
  name: string;
  options: string[];
  disabled?: boolean;
}) {
  return (
    <fieldset>
      <legend className="font-body text-sm tracking-wider text-hct-silver mb-4">
        <ContentText>{label}</ContentText>
      </legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => (
          <label
            key={opt}
            className="min-h-11 flex items-center gap-3 cursor-pointer group"
          >
            <input
              type="checkbox"
              name={name}
              value={opt}
              disabled={disabled}
              className="appearance-none w-4 h-4 border border-hct-silver/60 rounded-sm checked:bg-hct-silver checked:border-hct-silver transition-colors shrink-0 cursor-pointer"
            />
            <span className="font-body font-light text-sm text-hct-mist group-hover:text-hct-cloud transition-colors">
              <ContentText>{opt}</ContentText>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function SelectField({
  label,
  name,
  options,
  disabled,
}: {
  label: string;
  name: string;
  options: string[];
  disabled?: boolean;
}) {
  return (
    <div>
      <FieldLabel htmlFor={name}><ContentText>{label}</ContentText></FieldLabel>
      <div className="relative">
        <select
          id={name}
          name={name}
          disabled={disabled}
          className={`${inputBase} appearance-none cursor-pointer pr-8`}
          defaultValue=""
        >
          <option value="" disabled className="bg-hct-ink text-hct-silver"><ContentText>
            Select one…
          </ContentText></option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-hct-ink text-hct-cloud">
              <ContentText>{opt}</ContentText>
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-hct-silver/50"><ContentText>
          ▾
        </ContentText></span>
      </div>
    </div>
  );
}

export function FormError({ message }: { message?: string }) {
  return (
    <p role="alert" className="text-rose-300 text-sm font-body">
      <ContentText>{message || "We could not save your form. Please try again later."}</ContentText>
    </p>
  );
}

export function SuccessMessage({
  message = "Thank you. We'll be in touch soon.",
}: {
  message?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-hct-ink/60 border border-hct-silver/20 rounded-sm p-10 text-center bg-atmosphere"
    >
      <p className="font-display font-light text-2xl md:text-3xl text-hct-cloud">
        <ContentText>{message}</ContentText>
      </p>
    </motion.div>
  );
}
