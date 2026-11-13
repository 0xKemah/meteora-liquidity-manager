"use client";

import { useState, type FormEvent } from "react";

interface TokenMetadata {
  id: string;
  name?: string;
  symbol?: string;
  icon?: string;
  decimals?: number;
  usdPrice?: number;
  mcap?: number;
}

interface DlmmPosition {
  positionAddress: string;
  owner: string;
  lowerBinId: number;
  upperBinId: number;
  totalXAmount: string;
  totalYAmount: string;
  feeX: string;
  feeY: string;
  tokenXMint: string;
  tokenYMint: string;
  tokenX: TokenMetadata | null;
  tokenY: TokenMetadata | null;
  tokenXDecimals: number;
  tokenYDecimals: number;
}

interface DlmmPool {
  poolAddress: string;
  positions: DlmmPosition[];
}

function formatTokenAmount(amount: string | number, decimals: number): string {
  const rawAmount = BigInt(amount.toString());
  const divisor = BigInt(10) ** BigInt(decimals);

  const whole = rawAmount / divisor;
  const remainder = rawAmount % divisor;

  const fraction = remainder
    .toString()
    .padStart(decimals, "0")
    .slice(0, 6)
    .replace(/0+$/, "");

  return fraction ? `${whole}.${fraction}` : whole.toString();
}

export function WalletSearch() {
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [positions, setPositions] = useState<DlmmPosition[]>([]);
  const [totalPools, setTotalPools] = useState(0);

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

      const balanceResponse = await fetch("/api/wallets/balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: value }),
      });

      const balanceResult = await balanceResponse.json();

      if (!balanceResponse.ok) {
        setIsValid(false);
        setMessage(balanceResult.error || "Unable to retrieve wallet balance.");
        return;
      }

      const positionsResponse = await fetch("/api/wallets/positions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: value }),
      });

      const positionsResult = await positionsResponse.json();

      if (!positionsResponse.ok) {
        setPositions([]);
        setTotalPools(0);
        setIsValid(false);
        setMessage(
          positionsResult.error || "Unable to retrieve DLMM positions.",
        );
        return;
      }

      setPositions(
        positionsResult.pools.flatMap((pool: DlmmPool) => pool.positions),
      );
      setTotalPools(positionsResult.totalPools);

      setIsValid(true);
      setMessage(`Wallet balance: ${balanceResult.sol.toFixed(6)} SOL`);
    } catch {
      setPositions([]);
      setTotalPools(0);
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
      {isValid && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">
            DLMM Positions ({positions.length})
          </h3>

          <p className="text-sm text-muted-foreground">
            Found in {totalPools} liquidity pool(s).
          </p>

          {positions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No active DLMM positions found for this wallet.
            </p>
          ) : (
            positions.map((position) => (
              <div
                key={position.positionAddress}
                className="rounded-xl border border-line bg-surface p-4 space-y-2"
              >
                <p className="text-sm font-medium">
                  Position: {position.positionAddress}
                </p>

                <p className="text-sm text-muted-foreground">
                  Owner: {position.owner}
                </p>

                <p className="text-sm text-muted-foreground">
                  Bin range: {position.lowerBinId} – {position.upperBinId}
                </p>

                <p className="text-sm">
                  {position.tokenX?.name ?? "Unknown Token"} (
                  {position.tokenX?.symbol ?? "X"}):{" "}
                  {formatTokenAmount(
                    position.totalXAmount,
                    position.tokenXDecimals,
                  )}
                </p>

                <p className="text-sm">
                  {position.tokenY?.name ?? "Unknown Token"} (
                  {position.tokenY?.symbol ?? "Y"}):{" "}
                  {formatTokenAmount(
                    position.totalYAmount,
                    position.tokenYDecimals,
                  )}
                </p>

                <p className="text-sm">
                  Fees X:{" "}
                  {formatTokenAmount(position.feeX, position.tokenXDecimals)}
                </p>

                <p className="text-sm">
                  Fees Y:{" "}
                  {formatTokenAmount(position.feeY, position.tokenYDecimals)}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </form>
  );
}
