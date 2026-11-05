<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


# Meteora Liquidity Manager — Project Instructions

## Project Overview
A non-custodial web application for discovering,
monitoring and managing Meteora DLMM liquidity positions
on Solana.

## Core Technologies
- Next.js
- React
- TypeScript
- Tailwind CSS
- Solana
- Meteora DLMM SDK
- PostgreSQL / Supabase

## Engineering Principles
1. Use TypeScript for application code.
2. Write modular, reusable and maintainable code.
3. Prioritise security and correctness.
4. Never expose private keys or seed phrases.
5. Never sign transactions without proper user authorization.
6. Validate user inputs.
7. Handle loading, error and empty states.
8. Test important business logic.
9. Explain significant architectural decisions.
10. Avoid unnecessary dependencies.

## Development Workflow
- Inspect existing code before modifying it.
- Explain proposed changes before implementation.
- Avoid modifying unrelated files.
- Run relevant tests after implementation.
- Never claim a feature works without verifying it.

## Product Scope
Initial protocol integration: Meteora DLMM only.

Users should be able to:
- Search public Solana wallets.
- Discover active DLMM positions.
- Connect their wallets.
- Manage liquidity through wallet-signed transactions.
- Configure SOL price-triggered exit strategies.

Automated fund movement must remain disabled until
a secure authorization mechanism has been established.
