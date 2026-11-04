const steps = [
  {
    title: "Search wallet",
    body: "Paste a Solana address. The dashboard will use that address as the starting point for discovery.",
  },
  {
    title: "Explore positions",
    body: "Review the active Meteora DLMM positions tied to that address before changing anything.",
  },
  {
    title: "Connect and manage",
    body: "Connect the wallet that controls those positions when you are ready to add, remove, or exit liquidity.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-t border-line bg-surface/40"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          How it works
        </h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="font-mono text-sm text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
