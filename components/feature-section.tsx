const features = [
  {
    title: "Discover liquidity positions",
    body: "Start from a wallet address and find the Meteora DLMM positions that address currently holds.",
  },
  {
    title: "Manage DLMM positions",
    body: "Review ranges and liquidity in one place, then decide what to add, remove, or leave untouched.",
  },
  {
    title: "Automated price-triggered exits",
    body: "Set an exit for when price leaves a range, so a position can close without a manual watch.",
  },
];

export function FeatureSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Built for active DLMM liquidity
        </h2>
        <p className="mt-3 text-base leading-7 text-muted">
          Three jobs this dashboard is designed to cover. None of them run
          against a live wallet yet.
        </p>
      </div>
      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {features.map((feature, index) => (
          <li
            key={feature.title}
            className="rounded-2xl border border-line bg-surface p-6"
          >
            <p className="font-mono text-xs text-accent">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-4 text-lg font-semibold tracking-tight">
              {feature.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted">{feature.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
