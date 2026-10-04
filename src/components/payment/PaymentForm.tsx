"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  getStripePromise,
  hasStripePublishableKey,
  STRIPE_RETURN_URL,
} from "@/lib/stripe";
import { X } from "lucide-react";

type PaymentFormProps = {
  clientSecret: string;
  bookingId?: number;
  onSuccess?: (message: string) => void;
  onClose?: () => void;
};

const cardOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#2c3829",
      fontFamily: "system-ui, -apple-system, sans-serif",
      "::placeholder": { color: "#8a9a84" },
      lineHeight: "24px",
    },
    invalid: { color: "#b4533c" },
  },
  hidePostalCode: true,
};

function CheckoutForm({
  clientSecret,
  bookingId,
  onSuccess,
  onClose,
}: {
  clientSecret: string;
  bookingId?: number;
  onSuccess?: (message: string) => void;
  onClose?: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [cardComplete, setCardComplete] = useState(false);

  async function pay(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) {
      setError("Card field failed to load. Refresh the page.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      // Equivalent to: stripe payment_intents confirm pi_... --payment-method=pm_card_visa
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card,
          },
        },
      );

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
      <div>
        <label className="mb-1.5 block text-sm text-forest">Card details</label>
        {/* min-height so Stripe iframe is always visible and clickable */}
        <div
          className="min-h-[48px] rounded-2xl border border-sand bg-white px-4 py-3 shadow-sm"
          style={{ minHeight: 48 }}
        >
          <CardElement
            options={cardOptions}
            onChange={(e) => {
              setCardComplete(e.complete);
              if (e.error) setError(e.error.message);
              else setError("");
            }}
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <p className="text-xs text-muted">
        Test card: <code className="text-forest">4242 4242 4242 4242</code> · any
        future date · any CVC
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
          disabled={!stripe || !elements || submitting || !cardComplete}
          className="w-full rounded-full bg-forest py-3 text-sm text-cream transition hover:bg-moss disabled:opacity-60"
        >
          {submitting ? "Processing…" : "Pay now"}
        </button>
      </div>
    </form>
  );
}

/**
 * Stripe card modal. client_secret comes from create_payment response.
 * CardElement does not need clientSecret on <Elements> — only on confirmCardPayment.
 */
export default function PaymentForm({
  clientSecret,
  bookingId,
  onSuccess,
  onClose,
}: PaymentFormProps) {
  const [stripeReady, setStripeReady] = useState(false);

  useEffect(() => {
    getStripePromise().then((s) => setStripeReady(Boolean(s)));
  }, []);

  if (!clientSecret) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close payment"
        className="absolute inset-0 bg-forest/45 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-t-3xl border border-white/50 bg-cream p-6 shadow-xl sm:rounded-3xl">
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

        {!hasStripePublishableKey ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <p className="font-medium">Stripe publishable key is missing.</p>
            <p className="mt-1 text-xs">
              Add to <code>.env.local</code>:
            </p>
            <pre className="mt-2 overflow-x-auto rounded bg-white/80 p-2 text-xs">
              {`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`}
            </pre>
            <p className="mt-2 text-xs">Then restart <code>npm run dev</code>.</p>
          </div>
        ) : !stripeReady ? (
          <p className="text-sm text-muted">Loading Stripe…</p>
        ) : (
          <Elements stripe={getStripePromise()}>
            <CheckoutForm
              clientSecret={clientSecret}
              bookingId={bookingId}
              onSuccess={onSuccess}
              onClose={onClose}
            />
          </Elements>
        )}

        <p className="mt-3 text-[10px] text-muted/80">return_url: {STRIPE_RETURN_URL}</p>
      </div>
    </div>
  );
}
