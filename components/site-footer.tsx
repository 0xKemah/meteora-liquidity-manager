export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div
        id="documentation"
        className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12 sm:px-6"
      >
        <h2 className="text-sm font-semibold tracking-tight">Documentation</h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
          Guides for searching wallets and managing DLMM positions will live
          here. This preview does not call a program, RPC, or wallet adapter.
        </p>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Meteora Liquidity Manager</p>
          <p>A Solana liquidity dashboard. Preview only.</p>
        </div>
      </div>
    </footer>
  );
}
