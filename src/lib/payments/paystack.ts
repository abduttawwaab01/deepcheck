/**
 * Paystack payment integration.
 * Uses Paystack's inline.js for client-side payment processing.
 * Paystack POP (Pay on Phone) is the standard Nigerian payment gateway.
 */

export interface PaystackConfig {
  publicKey: string;
  email: string;
  amount: number; // in kobo (₦1 = 100 kobo)
  reference: string;
  metadata?: Record<string, unknown>;
  onSuccess: (reference: string) => void;
  onCancel: () => void;
  onError: (error: string) => void;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        ref: string;
        metadata?: Record<string, unknown>;
        callback: (response: { reference: string; status: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

export function initiatePaystackPayment(config: PaystackConfig): void {
  const { publicKey, email, amount, reference, metadata, onSuccess, onCancel, onError } = config;

  if (typeof window === "undefined" || !window.PaystackPop) {
    // Load Paystack script dynamically
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = () => {
      openPaystack(publicKey, email, amount, reference, metadata, onSuccess, onCancel, onError);
    };
    script.onerror = () => onError("Failed to load Paystack");
    document.head.appendChild(script);
    return;
  }

  openPaystack(publicKey, email, amount, reference, metadata, onSuccess, onCancel, onError);
}

function openPaystack(
  key: string, email: string, amount: number, ref: string,
  metadata?: Record<string, unknown>,
  onSuccess?: (reference: string) => void,
  onCancel?: () => void,
  onError?: (error: string) => void,
) {
  try {
    const handler = window.PaystackPop.setup({
      key,
      email,
      amount,
      ref,
      metadata,
      callback: (response) => {
        if (response.status === "success") {
          onSuccess?.(response.reference);
        }
      },
      onClose: () => {
        onCancel?.();
      },
    });
    handler.openIframe();
  } catch (err) {
    onError?.(err instanceof Error ? err.message : "Payment failed");
  }
}

export function generateReference(): string {
  return `DC-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export function formatAmountInKobo(amountNaira: number): number {
  return Math.round(amountNaira * 100);
}

// Price constants (in Naira)
export const PRICES = {
  COIN_PRICE: 2000,
  BUNDLE_20_PRICE: 35000,
  BUNDLE_20_COINS: 20,
} as const;
