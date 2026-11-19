"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { createClient } from "@/lib/supabase/client";

export function ConnectWalletButton() {
  const walletAdapter = useWallet();

  const {
    wallet,
    publicKey,
    connected,
    connecting,
    connect,
    disconnect,
    signMessage,
  } = walletAdapter;

  const { setVisible } = useWalletModal();

  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const address = publicKey?.toBase58();

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
    } else {
      setVisible(true);
    }
  }

  async function handleSignIn() {
    setError("");
    setLoading(true);

    try {
      if (!publicKey || !connected || !signMessage) {
        throw new Error("Your wallet does not support message signing.");
      }

      const supabase = createClient();

      const { data, error } = await supabase.auth.signInWithWeb3({
        chain: "solana",
        statement: "Sign in to Meteora Liquidity Manager.",
      });

      if (error) throw error;

      if (!data.session) {
        throw new Error("Authentication completed without a session.");
      }

      setAuthenticated(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Wallet authentication failed.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDisconnect() {
    setError("");
    await disconnect();
    setAuthenticated(false);
  }

  if (connected && address) {
    return (
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-line px-3 py-2 text-sm">
            {address.slice(0, 4)}...{address.slice(-4)}
          </span>

          {!authenticated ? (
            <button
              type="button"
              onClick={handleSignIn}
              disabled={loading}
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          ) : (
            <span className="text-sm text-green-400">Authenticated</span>
          )}

          <button
            type="button"
            onClick={handleDisconnect}
            className="rounded-full border border-line px-4 py-2 text-sm"
          >
            Disconnect
          </button>
        </div>

        {error && (
          <p role="alert" className="max-w-56 text-xs text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleConnect}
        disabled={connecting}
        className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-4 text-sm font-semibold text-accent-foreground disabled:opacity-60"
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
