"use client";

import { useState } from "react";

export function ConnectWalletButton() {
  const [notice, setNotice] = useState("");

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={() =>
          setNotice("Wallet connection is not available in this preview.")
        }
        className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-4 text-sm font-semibold text-accent-foreground transition-colors hover:bg-accent/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Connect Wallet
      </button>
      {notice ? (
        <p role="status" className="max-w-48 text-right text-xs text-muted">
          {notice}
        </p>
      ) : null}
    </div>
  );
}
