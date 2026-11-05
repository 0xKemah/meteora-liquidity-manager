# Meteora Liquidity Manager
## Product Requirements Document (PRD)

**Version:** 1.0
**Date:** November 5, 2026
**Product Type:** Non-custodial Solana Web Application
**Initial Protocol:** Meteora DLMM
**Status:** Initial Product Specification

---

# 1. Product Overview

## 1.1 Product Vision

Meteora Liquidity Manager is a comprehensive, non-custodial liquidity management platform that enables Solana liquidity providers to discover positions, monitor performance, manage liquidity and automate risk-management strategies across Meteora DLMM.

The platform aims to simplify liquidity management by combining portfolio monitoring, liquidity management, performance analytics and automated take-profit and stop-loss functionality in one application.

## 1.2 Problem Statement

Meteora DLMM liquidity providers currently need to monitor their positions and market conditions continuously to manage their liquidity effectively.

This creates several challenges:

- Limited visibility across multiple liquidity positions.
- Difficulty monitoring liquidity ranges, token balances and accumulated fees.
- Dependence on manual monitoring of token prices and market conditions.
- Risk of missing profitable exit opportunities.
- Exposure to losses when market conditions deteriorate.
- Limited access to consolidated portfolio performance information.

Meteora Liquidity Manager aims to solve these problems through a unified position-management and automated exit platform.

## 1.3 Proposed Solution

Build a platform that allows users to:

1. Discover public Meteora DLMM positions by searching Solana wallet addresses.
2. Monitor active liquidity positions and portfolio performance.
3. Manage liquidity through wallet-authorized transactions.
4. Configure take-profit and stop-loss exit strategies.
5. Authorize automated withdrawals in advance.
6. Receive notifications and track execution results.
7. Review historical positions and portfolio performance.

---

# 2. Target Users

## 2.1 Primary Target Audience

Active individual liquidity providers.

These are individuals who actively provide liquidity on Meteora DLMM using their own Solana wallets.

### User characteristics

- Own and manage Solana wallets.
- Provide liquidity across Meteora DLMM pools.
- Monitor token prices, liquidity ranges and trading fees.
- Want better visibility into their liquidity positions.
- Want to protect capital and secure profits through predefined exit strategies.
- Prefer a unified interface for monitoring and managing their positions.

## 2.2 Secondary Audience

- Professional liquidity providers.
- Crypto traders exploring liquidity strategies.
- Researchers analysing public Solana wallets.

These audiences may receive additional functionality in future releases.

---

# 3. Product Architecture and Access Model

## 3.1 Public Wallet Exploration

The application must allow anyone to search public Solana wallet addresses without connecting a wallet or creating an account.

Users should be able to:

- Search any valid public Solana wallet address.
- Discover active Meteora DLMM positions associated with that wallet.
- View supported pool and token-pair information.
- Inspect position addresses.
- View liquidity values and token balances.
- View price ranges and current pool prices.
- Determine whether positions are in or out of range.
- Inspect unclaimed fees where available.

Public wallet exploration must not grant visitors permission to manage or withdraw another user's liquidity.

## 3.2 Wallet Connection

Wallet connection is required when users want to perform personal liquidity-management actions.

Initial wallet support:

- Phantom.
- Solflare.

Users will connect one Solana wallet at a time in the MVP.

Users may disconnect and connect another wallet.

The application must verify wallet ownership through cryptographic message signing where authenticated ownership is required.

## 3.3 Access Permissions

Public visitors can inspect public wallet information.

Connected wallet owners can access authorized management functionality.

Delegated execution mechanisms may only perform actions explicitly authorized by the wallet owner.

---

# 4. Core Product Modules

## 4.1 Wallet Explorer

A public wallet discovery interface.

Requirements:

- Search by Solana wallet address.
- Validate wallet address input.
- Retrieve supported Meteora DLMM positions.
- Display position information.
- Handle wallets with no active positions.
- Handle unavailable or invalid wallet addresses.
- Provide loading, error and refresh states.

## 4.2 Portfolio Dashboard

A central dashboard showing the connected wallet's liquidity portfolio.

Requirements:

- Total portfolio value.
- Total capital deployed, where reliably calculable.
- Number of active positions.
- Number of closed positions.
- Aggregate trading fees earned.
- Realised profit and loss.
- Unrealised profit and loss.
- Historical portfolio performance.
- Individual position contributions.

Portfolio calculations must distinguish investment returns from deposits and withdrawals.

## 4.3 Position Manager

Users must be able to manage their Meteora DLMM positions.

Supported actions:

- Add liquidity.
- Withdraw liquidity.
- Claim unclaimed fees.
- View position details.
- Inspect token balances.
- Inspect pool information.
- Monitor current prices and liquidity ranges.

All user-initiated transactions must be reviewed and signed through the connected wallet.

## 4.4 Exit Strategy Manager

This is one of the platform's primary differentiating features.

Users must be able to configure automated take-profit and stop-loss strategies for individual liquidity positions.

### A. Take-Profit Orders

Users can configure a target condition at which the platform should withdraw the selected position.

Example:

- Selected position: SOL/MEME.
- Trigger type: Token price.
- Target price: $0.025.
- Exit action: Withdraw 100% of selected position.

### B. Stop-Loss Orders

Users can configure a downside condition at which the platform should withdraw the selected position.

Example:

- Selected position: SOL/MEME.
- Trigger type: Market capitalisation.
- Stop-loss threshold: $1,000,000.
- Exit action: Withdraw 100% of selected position.

### C. Trigger Types

Users must choose ONE trigger type for each exit strategy:

1. Token price.
2. Token market capitalisation.

Price and market capitalisation must not be combined in the same exit strategy.

Take-profit and stop-loss strategies are configured independently. A user may configure both for the same position, with each using its own selected trigger type.

### D. Exit Behaviour

When an exit condition is satisfied, the platform must initiate withdrawal of 100% of the selected position's liquidity.

The application should distinguish between withdrawing liquidity, claiming accrued fees and closing the underlying position account.

The exact transaction sequence must follow Meteora DLMM's supported transaction instructions.

---

# 5. Automated Execution System

## 5.1 Core Requirement

Users must be able to authorize the platform to execute predefined liquidity withdrawals without requiring further approval when the configured exit conditions are met.

The user should not need to remain online or connected to the application for an authorized strategy to execute.

## 5.2 Authorization Workflow

1. User connects their Solana wallet.
2. User selects an active liquidity position.
3. User configures a take-profit or stop-loss strategy.
4. User reviews the proposed authorization permissions.
5. User signs an explicit authorization transaction.
6. The application records the authorization and strategy.
7. The monitoring engine continuously evaluates the trigger condition.
8. When the condition is satisfied, the execution engine validates the position and authorization.
9. The execution engine submits the withdrawal transaction.
10. The application records the transaction result and notifies the user.

## 5.3 Delegated Authorization Requirements

The execution mechanism must:

- Require explicit user authorization.
- Restrict permissions to the intended position and actions.
- Prevent unauthorized transfers or unrelated transactions.
- Support revocation by the wallet owner.
- Support defined authorization validity periods where appropriate.
- Protect delegated signing credentials.
- Prevent duplicate execution.
- Maintain an auditable execution history.

### Technical Feasibility Requirement

The engineering team must investigate whether Meteora DLMM supports the required delegated withdrawal mechanism.

Possible approaches to investigate include:

- Protocol-supported position authority delegation.
- A secure on-chain authorization or execution program.
- A compatible smart-account architecture.
- Other secure and explicitly authorized Solana transaction-execution mechanisms.

No particular delegation approach should be assumed to work until verified against the protocol's actual instructions and security model.

If unattended execution cannot be implemented safely, the application must clearly fall back to trigger notifications followed by user-signed withdrawals.

The product must not claim to support unattended execution until the authorization and execution architecture has been implemented and security-reviewed.

## 5.4 Execution Engine

The execution engine must:

- Monitor active exit strategies.
- Detect satisfied trigger conditions.
- Validate the relevant price or market-cap data.
- Check that the authorization remains valid.
- Confirm that the selected position still exists.
- Verify that the position contains withdrawable liquidity.
- Simulate transactions where supported.
- Submit authorized withdrawal transactions.
- Verify on-chain transaction outcomes.
- Record transaction signatures and status.
- Prevent duplicate execution.

## 5.5 Failed Execution and Retry Handling

The system must automatically retry eligible failed withdrawal attempts.

Requirements:

- Configurable maximum retry count.
- Appropriate retry delays.
- Transaction confirmation checks.
- On-chain state verification before resubmission.
- Position revalidation.
- Authorization revalidation.
- Duplicate transaction protection.
- Execution attempt logging.
- Notifications when retries are exhausted.

Transactions with unknown outcomes must be reconciled against on-chain state before another withdrawal is submitted.

The system must never blindly resubmit a potentially successful withdrawal.

---

# 6. Market Data and Trigger Monitoring

## 6.1 Token Price Monitoring

The application must monitor reliable token price data for configured exit strategies.

Requirements:

- Identify the correct token and price denomination.
- Use reliable market data sources.
- Detect stale or unavailable prices.
- Validate suspicious price movements.
- Define acceptable data freshness.
- Handle feed interruptions safely.

## 6.2 Market Capitalisation Monitoring

The application must support market-cap-based exit conditions.

Market capitalisation must be calculated using a reliable token price and a clearly defined token supply methodology.

The engineering team must investigate:

- Circulating supply availability.
- Total supply versus circulating supply.
- Token metadata reliability.
- Supply changes.
- Price-feed reliability.
- Market-cap data manipulation risks.

The application must clearly identify the market-cap methodology used.

## 6.3 Trigger Validation

Before executing a withdrawal, the monitoring system must verify that the configured threshold has genuinely been reached.

The system must consider:

- Data freshness.
- Price-feed reliability.
- Market-data manipulation.
- Temporary price spikes.
- Network interruptions.
- Trigger re-evaluation.

---

# 7. Position History and Analytics

## 7.1 Active Positions

Users must be able to inspect:

- Current liquidity value.
- Token balances.
- Pool and token pair.
- Position address.
- Current price.
- Lower and upper price boundaries.
- In-range or out-of-range status.
- Unclaimed fees.
- Active exit strategies.

## 7.2 Closed Positions

The application should retain historical records of closed positions.

Historical information should include:

- Position address.
- Pool and token pair.
- Entry information where available.
- Withdrawal information.
- Fees earned.
- Realised profit and loss where reliably calculable.
- Exit reason.
- Transaction signatures.
- Execution timestamps.

## 7.3 Portfolio Performance

The application should provide:

- Total capital deployed.
- Current portfolio value.
- Aggregate trading fees.
- Realised P&L.
- Unrealised P&L.
- Historical performance charts.
- Individual position contributions.

The accounting model must distinguish deposits, withdrawals, trading fees, asset-price movements and transaction costs.

Performance metrics must not be presented as verified profits when the underlying data is incomplete.

---

# 8. Notifications

## 8.1 MVP Notification Channels

Initial channels:

- In-app notifications.
- Email notifications.

Telegram notifications may be introduced in a future release.

## 8.2 Notification Events

Users should be notified when:

- A take-profit condition is triggered.
- A stop-loss condition is triggered.
- An exit transaction is submitted.
- A withdrawal succeeds.
- A transaction fails.
- An execution retry occurs.
- Retry limits are exhausted.
- An authorization is revoked or expires.
- The monitoring or price-feed service experiences an important interruption.

Notifications must distinguish between a trigger being detected, a transaction being submitted and a withdrawal being confirmed.

---

# 9. MVP Scope

## 9.1 Must-Have Features

- Public Solana wallet search.
- Meteora DLMM position discovery.
- Wallet connection.
- Active position dashboard.
- Add liquidity.
- Withdraw liquidity.
- Claim fees.
- Take-profit configuration.
- Stop-loss configuration.
- Token-price triggers.
- Market-cap triggers.
- Full-position withdrawal.
- Secure delegated authorization.
- Unattended execution when authorized.
- Execution monitoring.
- Safe automatic retries.
- Duplicate execution protection.
- In-app notifications.
- Transaction history.

Unattended execution is a mandatory product objective, subject to successful technical feasibility and independent security validation.

## 9.2 Should-Have Features

- Closed-position history.
- Portfolio-wide performance analytics.
- Email notifications.
- Historical performance charts.

## 9.3 Future Features

- Telegram notifications.
- Multiple connected wallets and aggregated portfolios.
- Advanced liquidity performance analytics.
- Additional Solana liquidity protocols.
- Advanced strategy automation.

---

# 10. Non-Functional Requirements

## 10.1 Security

- Never request or store users' seed phrases.
- Never expose private keys or signing credentials.
- Encrypt sensitive credentials and secrets.
- Implement secure authentication and authorization.
- Validate all transaction instructions.
- Protect against replay and duplicate execution.
- Implement rate limiting.
- Maintain audit logs.
- Protect against unauthorized access.
- Validate all external market-data inputs.

## 10.2 Reliability

- Monitor background execution services.
- Handle RPC failures.
- Handle price-feed interruptions.
- Support safe transaction retries.
- Maintain persistent execution records.
- Prevent duplicate withdrawals.
- Provide clear failure reporting.

## 10.3 Performance

- Provide responsive dashboard loading.
- Cache appropriate public position information.
- Avoid unnecessary RPC requests.
- Support efficient background monitoring.
- Ensure the interface remains usable during network interruptions.

## 10.4 Usability

- Simple wallet discovery.
- Clear position information.
- Understandable exit-strategy configuration.
- Transparent transaction authorization.
- Clear execution status.
- Responsive desktop and mobile interfaces.

---

# 11. Proposed Technical Stack

The following is the initial architecture proposal and must be validated during technical design.

| Layer | Proposed technology |
|---|---|
| Frontend | Next.js and React |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Blockchain | Solana |
| Protocol integration | Meteora DLMM SDK |
| Wallet integration | Solana Wallet Adapter |
| Price data | Pyth and validated market-data sources |
| Database | PostgreSQL |
| Backend services | Next.js API and modular services |
| Background execution | Dedicated worker and job queue |
| Hosting | Vercel and suitable worker infrastructure |
| Testing | Vitest and Playwright |
| Version control | Git and GitHub |

The architecture should support a modular application with clearly separated responsibilities for wallet discovery, portfolio management, market monitoring and transaction execution.

---

# 12. Key Data Entities

The initial database design should investigate the following entities:

1. Users.
2. Connected wallets.
3. Position cache.
4. Exit strategies.
5. Authorization records.
6. Execution jobs.
7. Execution attempts.
8. Transactions.
9. Notifications.
10. Position history.

The database must distinguish between on-chain facts and application-generated records.

On-chain transaction signatures and state should be treated as authoritative when reconciling execution results.

---

# 13. Acceptance Criteria

The MVP will be considered functionally complete when:

1. A visitor can search a valid public Solana wallet without connecting a wallet.
2. The application can retrieve and display supported Meteora DLMM positions.
3. A wallet owner can connect and view their positions.
4. The user can add liquidity, withdraw liquidity and claim fees through authorized transactions.
5. The user can configure take-profit and stop-loss strategies.
6. Each strategy uses either token price or market capitalisation, never both.
7. The user can authorize an exit strategy through an explicit authorization mechanism.
8. The monitoring engine detects valid exit conditions.
9. An authorized strategy can execute without the user being online.
10. The execution engine withdraws 100% of the selected position's liquidity.
11. Failed executions are handled through safe retries.
12. Duplicate withdrawals are prevented.
13. Users receive clear execution notifications.
14. The application maintains transaction and execution records.
15. Security testing validates the delegated authorization and withdrawal mechanism.

Items involving unattended execution cannot pass acceptance until the actual authorization mechanism has been implemented and independently reviewed.

---

# 14. Technical Risks and Open Questions

The following questions must be resolved before implementing automated fund movement:

1. Does Meteora DLMM support a secure delegated withdrawal mechanism?
2. Can delegation be restricted to an individual position?
3. How will execution signing credentials be generated, stored and protected?
4. How will authorization revocation work?
5. What happens if an exit trigger is reached while the Solana network is congested?
6. How will the system distinguish a failed transaction from an unconfirmed transaction?
7. Which price and market-cap data sources will be authoritative?
8. How will token supply changes affect market-cap triggers?
9. What happens when the position has already been manually withdrawn or modified?
10. How will the platform handle insufficient transaction fees or execution funds?

These questions must be addressed through technical investigation, testing and security review.

---

# 15. Future Product Vision

Beyond the initial MVP, Meteora Liquidity Manager aims to evolve into a comprehensive liquidity management platform for Solana.

Potential future capabilities include:

- Multi-wallet portfolio management.
- Advanced liquidity performance analytics.
- More sophisticated automated liquidity strategies.
- Telegram integration.
- Support for additional liquidity protocols.
- Advanced portfolio risk management.
- Strategy backtesting and historical analysis.

The long-term objective is to make liquidity management more accessible, measurable and automated while preserving user control and transaction security.

---

**End of Product Requirements Document — Version 1.0**
