import { loadStripe, type Stripe } from "@stripe/stripe-js";

const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim() || "";

export const hasStripePublishableKey = Boolean(key && key.startsWith("pk_"));

let promise: Promise<Stripe | null> | null = null;

export function getStripePromise(): Promise<Stripe | null> {
  if (!hasStripePublishableKey) {
    console.error(
      "[Stripe] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing or invalid. Add pk_test_... to .env.local and restart next dev.",
    );
    return Promise.resolve(null);
  }
  if (!promise) {
    promise = loadStripe(key);
  }
  return promise;
}

/** @deprecated use getStripePromise() */
export const stripePromise = getStripePromise();

export const STRIPE_RETURN_URL =
  process.env.NEXT_PUBLIC_STRIPE_RETURN_URL ||
  "http://localhost:8000/api/payment/success";
