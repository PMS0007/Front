"use client";

import { FormEvent, useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import { X } from "lucide-react";

const RETURN_URL =
  process.env.NEXT_PUBLIC_STRIPE_RETURN_URL ||
  "http://localhost:8000/api/payment/success";

type PaymentFormProps = {
  clientSecret: string;
  bookingId?: number;
  onSuccess?: (message: string) => void;
  onClose?: () => void;
};

function CheckoutForm({
  bookingId,
  onSuccess,
  onClose,
}: {
  bookingId?: number;
  onSuccess?: (message: string) => void;
  onClose?: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  async function pay(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setError("");
    try {
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: RETURN_URL,
        },
        redirect: "if_required",
      });

      if (confirmError) {
        setError(confirmError.message || "Payment failed");
        return;
      }

      const status = paymentIntent?.status ?? "succeeded";
      onSuccess?.(
        `Payment ${status}${bookingId != null ? ` for booking #${bookingId}` : ""}.`,
      );
      onClose?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={pay} className="space-y-4">
      <div className="rounded-2xl border border-sand bg-white/90 px-3 py-3">
        <PaymentElement onReady={() => setReady(true)} options={{ layout: "tabs" }} />
      </div>
      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <p className="text-xs text-muted">
        Test card: <code className="text-forest">4242 4242 4242 4242</code>
      </p>
      <div className="flex gap-2">
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="w-full rounded-full border border-sand bg-white py-3 text-sm text-forest hover:bg-fog disabled:opacity-60"
          >
            Cancel
          </button>
        ) : null}
        <button
          type="submit"
          disabled={!stripe || !elements || submitting || !ready}
          className="w-full rounded-full bg-forest py-3 text-sm text-cream transition hover:bg-moss disabled:opacity-60"
        >
          {submitting ? "Processing…" : "Pay now"}
        </button>
      </div>
    </form>
  );
}

/**
 * Stripe checkout modal. Requires a real client_secret from create_payment.
 */
export default function PaymentForm({
  clientSecret,
  bookingId,
  onSuccess,
  onClose,
}: PaymentFormProps) {
  if (!clientSecret) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close payment"
        className="absolute inset-0 bg-forest/45 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-t-3xl border border-white/50 bg-cream p-6 shadow-xl sm:rounded-3xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs tracking-[0.2em] text-moss uppercase">Payment</p>
            <h2 className="font-display text-2xl text-forest">
              Complete payment
              {bookingId != null ? ` · #${bookingId}` : ""}
            </h2>
          </div>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/70 text-forest"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: { theme: "stripe" },
          }}
        >
          <CheckoutForm
            bookingId={bookingId}
            onSuccess={onSuccess}
            onClose={onClose}
          />
        </Elements>
      </div>
    </div>
  );
}
