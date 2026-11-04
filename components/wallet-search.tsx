"use client";

import { useState, type FormEvent } from "react";

const SOLANA_ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

export function WalletSearch() {
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = address.trim();

    if (!value) {
      setMessage("Enter a wallet address.");
      return;
    }

    if (!SOLANA_ADDRESS.test(value)) {
      setMessage(
        "That does not look like a Solana address. Nothing was searched.",
      );
      return;
    }

    setMessage(
      "Wallet lookup is not connected yet. No positions were loaded.",
    );
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
          className="h-12 w-full rounded-full border border-line bg-surface px-5 text-sm text-foreground outline-none placeholder:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        />
        <button
          type="submit"
          className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Explore Wallet
        </button>
      </div>
      <p role="status" className="mt-3 min-h-5 text-sm text-muted">
        {message}
      </p>
    </form>
  );
}
