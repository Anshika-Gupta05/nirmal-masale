// Minimal typings + loader for Razorpay Checkout.js (https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/)

export interface RazorpaySuccess {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number; // paise
  currency: string;
  order_id: string;
  name: string;
  description?: string;
  image?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpaySuccess) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: 'payment.failed', cb: (res: { error: { description?: string } }) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';
let loading: Promise<boolean> | null = null;

/** Loads Checkout.js once. Resolves false if it can't be loaded (offline, blocked by an extension...). */
export function loadRazorpay(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (loading) return loading;

  loading = new Promise<boolean>((resolve) => {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      loading = null; // allow a retry
      resolve(false);
    };
    document.body.appendChild(script);
  });
  return loading;
}

export function openRazorpay(options: RazorpayOptions, onFailed: (message: string) => void) {
  const rzp = new window.Razorpay!(options);
  rzp.on('payment.failed', (res) => onFailed(res.error?.description || 'Payment failed. Please try again.'));
  rzp.open();
}

const LOGO_PATH = '/nirmal_gold_masale_logo_square.png';

/**
 * The logo for the Razorpay popup. Checkout runs inside Razorpay's own iframe, so a relative
 * path like "/logo.png" resolves against Razorpay's domain and breaks (it then shows a letter
 * instead). We embed the image as a base64 data URI, which works on localhost and in production
 * alike; if that fails we fall back to an absolute URL.
 */
export async function getCheckoutLogo(): Promise<string> {
  const absolute = `${window.location.origin}${LOGO_PATH}`;
  try {
    const res = await fetch(LOGO_PATH);
    if (!res.ok) return absolute;
    const blob = await res.blob();
    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : absolute);
      reader.onerror = () => resolve(absolute);
      reader.readAsDataURL(blob);
    });
  } catch {
    return absolute;
  }
}