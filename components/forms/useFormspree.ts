"use client";

import { useState } from "react";
import { FORMSPREE_ENDPOINT } from "@/lib/constants";

export type FormStatus = "idle" | "submitting" | "success" | "error";

export function useFormspree() {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function submit(data: Record<string, unknown>) {
    setStatus("submitting");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return { status, submit, setStatus };
}
