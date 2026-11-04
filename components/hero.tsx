import { WalletSearch } from "@/components/wallet-search";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.14),transparent_55%)]"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-20 sm:px-6 sm:py-28">
        <p className="text-sm font-medium tracking-wide text-accent">
          Solana DLMM liquidity
        </p>
        <div className="max-w-3xl space-y-5">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Your Meteora Liquidity. One Dashboard.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
            Search a wallet, review its active Meteora DLMM positions, and
            prepare the actions you will take once wallet connection is in
            place. This screen is the product shell. It does not read the
            chain.
          </p>
        </div>
        <WalletSearch />
      </div>
    </section>
  );
}
