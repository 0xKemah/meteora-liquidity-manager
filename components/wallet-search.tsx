"use client";

import { useState, type FormEvent } from "react";

export function WalletSearch() {
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);


async function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const value = address.trim();

  if (!value) {
    setMessage("Enter a wallet address.");
    setIsValid(null);
    return;
  }

  setLoading(true);
  setIsValid(null);
  setMessage("Validating Solana wallet address...");

  try {
    const response = await fetch("/api/wallets/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address: value }),
    });

    const result = await response.json();

    if (!response.ok) {
      setIsValid(false);
      setMessage(result.error || "Invalid wallet address.");
      return;
    }

    setIsValid(true);
    setMessage("Valid Solana address! Wallet lookup is coming next.");
  } catch {
    setIsValid(null);
    setMessage("Unable to reach the server. Please try again.");
  } finally {
    setLoading(false);
  }
}

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl" noValidate>
      <label htmlFor="wallet-address" className="text-sm font-medium">
        Wallet address
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id="wallet-address"
          name="wallet"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          autoComplete="off"
          spellCheck={false}
          placeholder="Solana wallet address"
          disabled={loading}
          className="h-12 w-full rounded-full border border-line bg-surface px-5 text-sm text-foreground outline-none placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {loading ? "Validating..." : "Explore Wallet"}
        </button>
      </div>
      <p
        role="status"
        aria-live="polite"
        className={`mt-3 min-h-5 text-sm ${
          isValid === true
            ? "text-green-500"
            : isValid === false
              ? "text-red-500"
              : "text-muted"
        }`}
      >
      {message}
      </p>
    </form>
  );
}
