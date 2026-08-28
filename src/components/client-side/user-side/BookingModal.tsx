"use client";

import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { rooms } from "@/data/hotelData";
import {
  formatLongDate,
  formatMoney,
  getRoom,
  isoDate,
  isValidEmail,
  isValidPhone,
  nightsBetween,
  type BookingDraft,
} from "@/lib/booking";
import { cn } from "@/lib/cn";

type BookingModalProps = {
  open: boolean;
  draft: BookingDraft;
  onChange: (next: BookingDraft) => void;
  onClose: () => void;
  onSuccess: (message: string) => void;
};

type GuestForm = {
  name: string;
  email: string;
  phone: string;
};

type FieldErrors = Partial<Record<keyof GuestForm | "dates" | "guests", string>>;

export default function BookingModal({
  open,
  draft,
  onChange,
  onClose,
  onSuccess,
}: BookingModalProps) {
  const titleId = useId();
  const [guest, setGuest] = useState<GuestForm>({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const room = getRoom(draft.roomId) ?? rooms[0];
  const nights = nightsBetween(draft.checkIn, draft.checkOut);
  const total = nights * room.price;

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

  function handleClose() {
    setErrors({});
    setSubmitting(false);
    onClose();
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (nights < 1) next.dates = "Check-out must be after check-in.";
    if (draft.guests < 1) next.guests = "At least one guest is required.";
    if (draft.guests > room.maxGuests) {
      next.guests = `${room.title} sleeps up to ${room.maxGuests} guests.`;
    }
    if (!guest.name.trim()) next.name = "Please enter your name.";
    if (!isValidEmail(guest.email)) next.email = "Enter a valid email address.";
    if (!isValidPhone(guest.phone)) next.phone = "Enter a valid phone number.";
    return next;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    window.setTimeout(() => {
      onSuccess(
        `Booking confirmed (mock). ${nights} night${nights === 1 ? "" : "s"} in ${room.title} — we’ll email ${guest.email}.`,
      );
      setGuest({ name: "", email: "", phone: "" });
      setSubmitting(false);
      handleClose();
    }, 700);
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-70 flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Close booking form"
            className="absolute inset-0 bg-forest/45 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl border border-white/50 bg-cream shadow-[0_40px_80px_-28px_rgba(44,56,41,0.55)] sm:rounded-3xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-sand px-5 py-5 sm:px-8">
              <div>
                <p className="text-xs tracking-[0.24em] text-moss uppercase">
                  Reserve
                </p>
                <h2 id={titleId} className="font-display text-3xl text-forest">
                  Confirm your stay
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/70 text-forest"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-8 px-5 py-6 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]"
              noValidate
            >
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="Check-in"
                    error={errors.dates}
                    htmlFor="book-in"
                  >
                    <input
                      id="book-in"
                      type="date"
                      value={draft.checkIn}
                      min={isoDate(0)}
                      onChange={(event) =>
                        onChange({ ...draft, checkIn: event.target.value })
                      }
                      className={inputClass(Boolean(errors.dates))}
                    />
                  </Field>
                  <Field label="Check-out" htmlFor="book-out">
                    <input
                      id="book-out"
                      type="date"
                      min={draft.checkIn}
                      value={draft.checkOut}
                      onChange={(event) =>
                        onChange({ ...draft, checkOut: event.target.value })
                      }
                      className={inputClass(Boolean(errors.dates))}
                    />
                  </Field>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="Guests"
                    error={errors.guests}
                    htmlFor="book-guests"
                  >
                    <input
                      id="book-guests"
                      type="number"
                      min={1}
                      max={room.maxGuests}
                      value={draft.guests}
                      onChange={(event) =>
                        onChange({
                          ...draft,
                          guests: Number(event.target.value) || 1,
                        })
                      }
                      className={inputClass(Boolean(errors.guests))}
                    />
                  </Field>
                  <Field label="Room" htmlFor="book-room">
                    <select
                      id="book-room"
                      value={draft.roomId}
                      onChange={(event) =>
                        onChange({ ...draft, roomId: event.target.value })
                      }
                      className={inputClass(false)}
                    >
                      {rooms.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="Full name" error={errors.name} htmlFor="book-name">
                  <input
                    id="book-name"
                    autoComplete="name"
                    value={guest.name}
                    onChange={(event) =>
                      setGuest({ ...guest, name: event.target.value })
                    }
                    className={inputClass(Boolean(errors.name))}
                    placeholder="Anna Kovalenko"
                  />
                </Field>
                <Field label="Email" error={errors.email} htmlFor="book-email">
                  <input
                    id="book-email"
                    type="email"
                    autoComplete="email"
                    value={guest.email}
                    onChange={(event) =>
                      setGuest({ ...guest, email: event.target.value })
                    }
                    className={inputClass(Boolean(errors.email))}
                    placeholder="you@email.com"
                  />
                </Field>
                <Field label="Phone" error={errors.phone} htmlFor="book-phone">
                  <input
                    id="book-phone"
                    type="tel"
                    autoComplete="tel"
                    value={guest.phone}
                    onChange={(event) =>
                      setGuest({ ...guest, phone: event.target.value })
                    }
                    className={inputClass(Boolean(errors.phone))}
                    placeholder="+380 67 000 00 00"
                  />
                </Field>
              </div>

              <aside className="h-fit rounded-3xl border border-sand bg-white/70 p-5 backdrop-blur-md">
                <p className="text-xs tracking-[0.2em] text-moss uppercase">
                  Summary
                </p>
                <h3 className="mt-2 font-display text-2xl text-forest">
                  {room.title}
                </h3>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  <li>
                    {formatLongDate(draft.checkIn)} →{" "}
                    {formatLongDate(draft.checkOut)}
                  </li>
                  <li>
                    {nights || 0} night{nights === 1 ? "" : "s"} · {draft.guests}{" "}
                    guest{draft.guests === 1 ? "" : "s"}
                  </li>
                  <li>
                    {formatMoney(room.price)} × {nights || 0}
                  </li>
                </ul>
                <div className="mt-5 flex items-end justify-between border-t border-sand pt-4">
                  <span className="text-sm text-muted">Total</span>
                  <span className="font-display text-3xl text-forest">
                    {formatMoney(total)}
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 w-full rounded-full bg-forest py-3 text-sm text-cream transition hover:bg-moss disabled:opacity-60"
                >
                  {submitting ? "Confirming…" : "Confirm Booking (Mock)"}
                </button>
                <p className="mt-3 text-center text-xs text-muted">
                  No payment is taken. This is a demo reservation.
                </p>
              </aside>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm text-forest">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-clay" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputClass(invalid: boolean) {
  return cn(
    "w-full rounded-2xl border bg-white/80 px-4 py-3 text-sm text-forest outline-none transition",
    invalid
      ? "border-clay/70 ring-2 ring-clay/20"
      : "border-sand focus:border-moss/40 focus:ring-2 focus:ring-moss/15",
  );
}
