export function Logo() {
  return (
    <a href="#top" className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path
            d="M6 17V11M10 17V7M14 17V12M18 17V9"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="text-sm leading-tight font-semibold tracking-tight">
        Meteora
        <span className="mt-0.5 block text-xs font-medium text-muted">
          Liquidity Manager
        </span>
      </span>
    </a>
  );
}
