"use client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function Form() {
  const stripe = useStripe();
  const elements = useElements();

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/payment/success` },
    });

    if (error) alert(error.message);
  };

  return (
    <form onSubmit={pay}>
      <PaymentElement />
      <button disabled={!stripe}>Оплатити</button>
    </form>
  );
}

export default function CheckoutPage() {
  const clientSecret = "pi_3UMoiX..._secret_..."; 

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <Form />
    </Elements>
  );
}