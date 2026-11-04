import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { Logo } from "@/components/logo";

const links = [
  { href: "#features", label: "Features" },
  { href: "#documentation", label: "Documentation" },
];

export function SiteHeader() {
  return (
    <header
      id="top"
      className="sticky top-0 z-20 border-b border-line bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />
        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 text-sm text-muted md:flex"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-start gap-2">
          <ConnectWalletButton />
          <details className="relative md:hidden">
            <summary className="flex h-10 cursor-pointer list-none items-center rounded-full border border-line px-3 text-sm text-foreground marker:content-none [&::-webkit-details-marker]:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              Menu
            </summary>
            <nav
              aria-label="Mobile"
              className="absolute right-0 z-30 mt-2 w-44 rounded-xl border border-line bg-surface p-2"
            >
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-white/5"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
