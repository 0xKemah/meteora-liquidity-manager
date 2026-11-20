"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { createClient } from "@/lib/supabase/client";

export function ConnectWalletButton() {
  const supabase = useMemo(() => createClient(), []);
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
  const pendingConnect = useRef(false);
  const autoSignInAfterReconnect = useRef(false);

  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted) {
        setAuthenticated(!!session);
      }

      console.log("RESTORED SUPABASE SESSION:", !!session);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    console.log("Wallet selection effect:", {
      pending: pendingConnect.current,
      wallet: wallet?.adapter.name,
      connected,
      connecting,
    });
    if (!pendingConnect.current || !wallet || connected || connecting) {
      return;
    }

    pendingConnect.current = false;
    console.log(
      "Automatically attempting wallet connection:",
      wallet?.adapter.name,
    );
    connect().catch((err: unknown) => {
      setError(
        err instanceof Error ? err.message : "Wallet connection failed.",
      );
    });
  }, [wallet, connected, connecting, connect]);

  useEffect(() => {
    if (
      !autoSignInAfterReconnect.current ||
      !connected ||
      !publicKey ||
      loading
    ) {
      return;
    }

    autoSignInAfterReconnect.current = false;
    handleSignIn();
  }, [connected, publicKey, loading]);

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
      pendingConnect.current = true;
      console.log(
        "Opening wallet modal. Pending connection:",
        pendingConnect.current,
      );
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
    setLoading(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      await disconnect();
      autoSignInAfterReconnect.current = true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to disconnect wallet.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (connected && address) {
    return (
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-line px-3 py-2 text-sm">
          {address.slice(0, 4)}...{address.slice(-4)}
        </span>

        <button
          type="button"
          onClick={handleDisconnect}
          disabled={loading}
          className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-60"
        >
          Disconnect
        </button>

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
