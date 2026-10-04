"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import {
  formatLongDate,
  formatMoney,
  isoDate,
  isValidEmail,
  isValidPhone,
  nightsBetween,
  type BookingDraft,
} from "@/lib/booking";
import { cn } from "@/lib/cn";
import RoomService from "@/services/rooms/RoomService";
import BookingService from "@/services/booking/BookingService";
import type { IRoom } from "@/interface/RoomInterface";
import PaymentForm from "@/components/payment/PaymentForm";

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

type FieldErrors = Partial<
  Record<keyof GuestForm | "dates" | "guests" | "room" | "form", string>
>;

const PAY_METHODS = [
  { value: "card", label: "Card" },
  { value: "cash", label: "Cash at hotel" },
  { value: "online", label: "Online transfer" },
] as const;

function unwrapRooms(data: unknown): IRoom[] {
  if (Array.isArray(data)) return data as IRoom[];
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data as IRoom[];
    if (Array.isArray(obj.results)) return obj.results as IRoom[];
    if (Array.isArray(obj.rooms)) return obj.rooms as IRoom[];
  }
  return [];
}

function roomTypeIdOf(room: IRoom): number | null {
  const rt = room.room_type;
  if (rt == null) return null;
  if (typeof rt === "number") return rt;
  if (typeof rt === "object" && typeof (rt as { id?: number }).id === "number") {
    return (rt as { id: number }).id;
  }
  return null;
}

function roomLabel(room: IRoom): string {
  const typeName =
    typeof room.room_type === "object" && room.room_type?.name
      ? room.room_type.name
      : "Room";
  const num = room.room_number != null ? `#${room.room_number}` : `#${room.id}`;
  return `${typeName} ${num}`;
}

function roomPrice(room: IRoom | undefined): number {
  if (!room) return 0;
  const rt = room.room_type;
  if (rt && typeof rt === "object" && rt.base_price != null) {
    return Number(rt.base_price) || 0;
  }
  return 0;
}

function roomCapacity(room: IRoom | undefined): number {
  if (!room) return 10;
  const rt = room.room_type;
  if (rt && typeof rt === "object" && rt.capacity != null) {
    return Number(rt.capacity) || 10;
  }
  return 10;
}

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
  const [payMethod, setPayMethod] = useState<string>("card");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [paymentClientSecret, setPaymentClientSecret] = useState<string | null>(null);
  const [paymentBookingId, setPaymentBookingId] = useState<number | null>(null);
  const [apiRooms, setApiRooms] = useState<IRoom[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    (async () => {
      setRoomsLoading(true);
      try {
        const data = await RoomService.listRoom();
        if (cancelled) return;
        const list = unwrapRooms(data).filter((r) => {
          const status = (r.status || "").toLowerCase();
          return !status || status === "available" || status === "free";
        });
        // if filter emptied everything, show all rooms
        const finalList = list.length > 0 ? list : unwrapRooms(data);
        setApiRooms(finalList);

        if (finalList.length > 0) {
          const currentId = Number(draft.roomId);
          const exists = finalList.some((r) => r.id === currentId);
          if (!exists && finalList[0].id != null) {
            onChange({ ...draft, roomId: String(finalList[0].id) });
          }
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setErrors((e) => ({
            ...e,
            form: "Could not load rooms. Check that you are logged in and the API is running.",
          }));
        }
      } finally {
        if (!cancelled) setRoomsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once when modal opens
  }, [open]);

  const selectedRoom = useMemo(() => {
    const id = Number(draft.roomId);
    return apiRooms.find((r) => r.id === id);
  }, [apiRooms, draft.roomId]);

  const nights = nightsBetween(draft.checkIn, draft.checkOut);
  const price = roomPrice(selectedRoom);
  const capacity = roomCapacity(selectedRoom);
  const total = nights * price;
  const title = selectedRoom ? roomLabel(selectedRoom) : "Select a room";

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
    setPaymentClientSecret(null);
    setPaymentBookingId(null);
    onClose();
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (nights < 1) next.dates = "Check-out must be after check-in.";
    if (draft.guests < 1) next.guests = "At least one guest is required.";
    if (draft.guests > capacity) {
      next.guests = `This room sleeps up to ${capacity} guests.`;
    }
    if (!selectedRoom?.id) next.room = "Please select a room.";
    const typeId = selectedRoom ? roomTypeIdOf(selectedRoom) : null;
    if (selectedRoom && typeId == null) next.room = "Room type is missing for this room.";
    if (!guest.name.trim()) next.name = "Please enter your name.";
    if (!isValidEmail(guest.email)) next.email = "Enter a valid email address.";
    if (!isValidPhone(guest.phone)) next.phone = "Enter a valid phone number.";
    return next;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const typeId = roomTypeIdOf(selectedRoom!);
    if (typeId == null || selectedRoom?.id == null) return;

    setSubmitting(true);
    setErrors({});
    try {
      const booking = await BookingService.create_booking({
        check_in_date: draft.checkIn,
        check_out_date: draft.checkOut,
        guest_count: draft.guests,
        room_type: typeId,
        room: selectedRoom.id,
      });

      const bookingId = booking?.id;
      if (bookingId == null) {
        setErrors({ form: "Booking created but no id was returned." });
        return;
      }

      // Non-card: no Stripe UI
      if (payMethod !== "card") {
        try {
          await BookingService.create_payment(bookingId, payMethod);
        } catch (payErr) {
          console.error("Payment step failed", payErr);
        }
        onSuccess(
          `Booking #${bookingId} created (${nights} night${nights === 1 ? "" : "s"} · ${title}). Pay method: ${payMethod}.`,
        );
        setGuest({ name: "", email: "", phone: "" });
        handleClose();
        return;
      }

      // Card: create_payment returns { client_secret, pay_id }
      const paymentRes = await BookingService.create_payment(bookingId, payMethod);
      const secret =
        paymentRes?.client_secret ||
        paymentRes?.clientSecret ||
        paymentRes?.payment_intent?.client_secret ||
        null;

      if (!secret) {
        setErrors({
          form: "Booking created, but no client_secret in create_payment response.",
        });
        return;
      }

      // Keep booking modal open underneath; show Stripe payment modal
      setPaymentBookingId(bookingId);
      setPaymentClientSecret(secret);
    } catch (err: any) {
      console.error(err);
      const detail =
        err?.response?.data?.detail ||
        err?.response?.data?.non_field_errors?.[0] ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        "Could not create booking. Make sure you are logged in.";
      setErrors({ form: String(detail) });
    } finally {
      setSubmitting(false);
    }
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
                {errors.form ? (
                  <p className="rounded-xl border border-clay/30 bg-clay/10 px-3 py-2 text-sm text-clay" role="alert">
                    {errors.form}
                  </p>
                ) : null}

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Check-in" error={errors.dates} htmlFor="book-in">
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
                  <Field label="Guests" error={errors.guests} htmlFor="book-guests">
                    <input
                      id="book-guests"
                      type="number"
                      min={1}
                      max={capacity}
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
                  <Field label="Room" error={errors.room} htmlFor="book-room">
                    <select
                      id="book-room"
                      value={draft.roomId}
                      disabled={roomsLoading || apiRooms.length === 0}
                      onChange={(event) =>
                        onChange({ ...draft, roomId: event.target.value })
                      }
                      className={inputClass(Boolean(errors.room))}
                    >
                      {roomsLoading ? (
                        <option value="">Loading rooms…</option>
                      ) : apiRooms.length === 0 ? (
                        <option value="">No rooms available</option>
                      ) : (
                        apiRooms.map((item) => (
                          <option key={item.id} value={String(item.id)}>
                            {roomLabel(item)}
                            {item.status ? ` · ${item.status}` : ""}
                          </option>
                        ))
                      )}
                    </select>
                  </Field>
                </div>

                <Field label="Payment method" htmlFor="book-pay">
                  <select
                    id="book-pay"
                    value={payMethod}
                    onChange={(event) => setPayMethod(event.target.value)}
                    className={inputClass(false)}
                  >
                    {PAY_METHODS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </Field>

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
                <h3 className="mt-2 font-display text-2xl text-forest">{title}</h3>
                <ul className="mt-4 space-y-2 text-sm text-muted">
                  <li>
                    {formatLongDate(draft.checkIn)} → {formatLongDate(draft.checkOut)}
                  </li>
                  <li>
                    {nights || 0} night{nights === 1 ? "" : "s"} · {draft.guests}{" "}
                    guest{draft.guests === 1 ? "" : "s"}
                  </li>
                  <li>
                    {formatMoney(price)} × {nights || 0}
                  </li>
                  <li className="text-xs">Pay · {PAY_METHODS.find((m) => m.value === payMethod)?.label}</li>
                </ul>
                <div className="mt-5 flex items-end justify-between border-t border-sand pt-4">
                  <span className="text-sm text-muted">Total</span>
                  <span className="font-display text-3xl text-forest">
                    {formatMoney(total)}
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={submitting || roomsLoading || apiRooms.length === 0}
                  className="mt-6 w-full rounded-full bg-forest py-3 text-sm text-cream transition hover:bg-moss disabled:opacity-60"
                >
                  {submitting ? "Confirming…" : "Confirm booking"}
                </button>
                <p className="mt-3 text-center text-xs text-muted">
                  Creates a real booking, then starts payment for the selected method.
                </p>
              </aside>
            </form>
          </motion.div>
        </motion.div>
      ) : null}
    {paymentClientSecret ? (
      <PaymentForm
        clientSecret={paymentClientSecret}
        bookingId={paymentBookingId ?? undefined}
        onSuccess={(msg) => {
          onSuccess(msg);
          setGuest({ name: "", email: "", phone: "" });
          setPaymentClientSecret(null);
          setPaymentBookingId(null);
          handleClose();
        }}
        onClose={() => {
          setPaymentClientSecret(null);
          setPaymentBookingId(null);
        }}
      />
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
