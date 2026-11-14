# Database Schema — Meteora Liquidity Manager

## 1. Overview

The application uses Supabase (PostgreSQL) as its database.

The database stores user wallets, Meteora liquidity positions, exit strategies, execution authorizations, transaction records, notifications and historical position data.

## 2. Database Tables

| Table            | Purpose                                           |
| ---------------- | ------------------------------------------------- |
| wallets          | Stores wallets connected to user accounts         |
| positions        | Stores discovered liquidity positions             |
| exit_strategies  | Stores take-profit and stop-loss configurations   |
| authorizations   | Tracks permissions for automated execution        |
| execution_logs   | Records execution attempts and their outcomes     |
| execution_jobs   | Manages queued execution tasks and retries        |
| transactions     | Tracks Solana transaction signatures and statuses |
| notifications    | Stores in-app user notifications                  |
| position_history | Stores historical position and fee snapshots      |

## 3. Relationships

- A user can have one connected wallet in the MVP.
- A wallet can have multiple liquidity positions.
- A position can have multiple exit strategies.
- An exit strategy can have multiple authorization records.
- An exit strategy can have multiple execution jobs.
- An execution job can have multiple execution logs.
- An execution job can have multiple transaction records.
- A position can have multiple historical snapshots.
- A user can have multiple notifications.

## 4. Important Constraints

- Wallet addresses must be unique.
- Position addresses must be unique.
- Strategy types are restricted to `take_profit` and `stop_loss`.
- Trigger metrics are restricted to `price` and `market_cap`.
- Target values must be greater than zero.
- Position statuses are restricted to `active` and `closed`.
- Execution jobs use an idempotency key to prevent duplicate jobs.
- Execution attempt counts cannot be negative.

## 5. Execution and Retry Architecture

`execution_jobs` represents a task waiting to be processed.

`execution_logs` records execution attempts and their outcomes.

`transactions` stores the corresponding Solana transaction information.

This separation allows the system to track retries, transaction submissions and final execution outcomes.

Before retrying an uncertain transaction, the execution worker must check the transaction status and on-chain position state.

## 6. Security and Row Level Security (RLS)

RLS is enabled on all nine tables.

Existing user-facing policies cover selected operations on the original five tables.

The newer tables currently have no user-facing policies. Access must remain restricted until appropriate policies are implemented and tested.

The Supabase service-role key must only be used in trusted server-side environments and must never be exposed to the browser.

## 7. Outstanding Database Work

- Create and test appropriate RLS policies for the newer tables.
- Define worker permissions for execution jobs and transaction records.
- Implement automatic timestamp updates where required.
- Validate database access through authenticated and unauthenticated requests.
- Review the schema before production deployment.

## 8. Important Architectural Note

Database records do not independently authorize blockchain transactions.

Automated withdrawals require a secure, verifiable on-chain authorization mechanism. Meteora DLMM operator withdrawal permissions remain subject to technical validation.

No unattended withdrawal functionality should be enabled until this mechanism has been implemented and security-reviewed.
