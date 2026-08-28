"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Phone, X } from "lucide-react";
import { isValidPhone } from "@/lib/booking";
import { cn } from "@/lib/cn";

type CallMeBackModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
};

type FormState = {
  name: string;
  phone: string;
  preferredTime: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

export default function CallMeBackModal({
  open,
  onClose,
  onSuccess,
}: CallMeBackModalProps) {
  const titleId = useId();
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    preferredTime: "anytime",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  function validate(): Errors {
    const next: Errors = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!isValidPhone(form.phone)) next.phone = "Enter a valid phone number.";
    if (!form.preferredTime) next.preferredTime = "Choose a preferred time.";
    return next;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    window.setTimeout(() => {
      onSuccess("We will call you back within 15 minutes!");
      setForm({ name: "", phone: "", preferredTime: "anytime" });
      setSubmitting(false);
      onClose();
    }, 600);
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-70 flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close callback form"
            className="absolute inset-0 bg-forest/45 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="relative w-full max-w-lg rounded-t-3xl border border-white/50 bg-cream p-6 shadow-[0_40px_80px_-28px_rgba(44,56,41,0.55)] sm:rounded-3xl sm:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/70 text-forest"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="mb-6 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest text-cream">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <h2 id={titleId} className="font-display text-3xl text-forest">
                  Зателефонуйте мені
                </h2>
                <p className="text-sm text-muted">
                  Leave your number — we call back within 15 minutes.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="cb-name" className="mb-1.5 block text-sm text-forest">
                  Name
                </label>
                <input
                  id="cb-name"
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  className={fieldClass(Boolean(errors.name))}
                  placeholder="Your name"
                />
                {errors.name ? (
                  <p className="mt-1.5 text-xs text-clay" role="alert">
                    {errors.name}
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="cb-phone" className="mb-1.5 block text-sm text-forest">
                  Phone number
                </label>
                <input
                  id="cb-phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(event) =>
                    setForm({ ...form, phone: event.target.value })
                  }
                  className={fieldClass(Boolean(errors.phone))}
                  placeholder="+380 67 000 00 00"
                />
                {errors.phone ? (
                  <p className="mt-1.5 text-xs text-clay" role="alert">
                    {errors.phone}
                  </p>
                ) : null}
              </div>
              <div>
                <label
                  htmlFor="cb-time"
                  className="mb-1.5 block text-sm text-forest"
                >
                  Preferred time to call
                </label>
                <select
                  id="cb-time"
                  value={form.preferredTime}
                  onChange={(event) =>
                    setForm({ ...form, preferredTime: event.target.value })
                  }
                  className={fieldClass(Boolean(errors.preferredTime))}
                >
                  <option value="anytime">Anytime today</option>
                  <option value="morning">Morning (09:00–12:00)</option>
                  <option value="afternoon">Afternoon (12:00–17:00)</option>
                  <option value="evening">Evening (17:00–21:00)</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-full bg-forest py-3 text-sm text-cream transition hover:bg-moss disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Request a call"}
              </button>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function fieldClass(invalid: boolean) {
  return cn(
    "w-full rounded-2xl border bg-white/80 px-4 py-3 text-sm text-forest outline-none transition",
    invalid
      ? "border-clay/70 ring-2 ring-clay/20"
      : "border-sand focus:border-moss/40 focus:ring-2 focus:ring-moss/15",
  );
}
