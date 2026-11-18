"use client";

import { useEffect, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export function ConnectWalletButton() {
  const { wallet, publicKey, connected, connecting, connect, disconnect } =
    useWallet();

  const { setVisible } = useWalletModal();

  const pendingConnect = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!pendingConnect.current || !wallet || connected || connecting) {
      return;
    }

    pendingConnect.current = false;

    void connect().catch((err: unknown) => {
      console.error("Wallet connection failed:", err);
      setError(
        err instanceof Error ? err.message : "Wallet connection failed.",
      );
    });
  }, [wallet, connected, connecting, connect]);

  async function handleConnect() {
    setError("");

    if (wallet) {
      try {
        await connect();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Wallet connection failed.",
        );
      }
      return;
    }

    pendingConnect.current = true;
    setVisible(true);
  }

  if (connected && publicKey) {
    const address = publicKey.toBase58();

    return (
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-line px-3 py-2 text-sm">
          {address.slice(0, 4)}...{address.slice(-4)}
        </span>

        <button
          type="button"
          onClick={() => void disconnect()}
          className="rounded-full border border-line px-4 py-2 text-sm"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleConnect}
        disabled={connecting}
        className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-60"
      >
        {connecting ? "Connecting..." : "Connect Wallet"}
      </button>

      {error && (
        <p role="alert" className="max-w-56 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
