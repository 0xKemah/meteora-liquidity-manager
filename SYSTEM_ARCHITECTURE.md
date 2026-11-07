# Meteora Liquidity Manager — System Architecture

## 1. Frontend

The frontend is the user-facing interface of the Meteora Liquidity Manager.

### Responsibilities
- Display the application dashboard and navigation.
- Allow users to search public Solana wallet addresses.
- Display liquidity positions, portfolio analytics and transaction history.
- Allow users to connect and disconnect supported wallets (Phantom and Solflare).
- Allow users to configure take-profit and stop-loss strategies.
- Display notifications, transaction statuses and error messages.
- Request user signatures when wallet authorization is required.

### Technologies
- Next.js
- React
- TypeScript
- Tailwind CSS
- Solana wallet adapters

### Important Security Rules
- Never request or store users' wallet seed phrases or private keys.
- Never assume wallet connection means transaction authorization.
- Clearly display transaction details before requesting signatures.
- Never execute automated withdrawals directly from the browser.

## 2. Backend API

The backend API is responsible for handling application logic and coordinating communication between the frontend, database and external services.

### Responsibilities
- Receive and process requests from the frontend.
- Validate wallet addresses and user inputs.
- Retrieve public wallet and Meteora position information.
- Authenticate users through wallet signature verification.
- Save and retrieve user configurations from the database.
- Validate take-profit and stop-loss strategies.
- Coordinate with the monitoring and execution services.
- Return structured responses and meaningful error messages.

### Technologies
- Next.js API routes or Route Handlers.
- TypeScript.
- Solana and Meteora SDK integrations.

### Important Security Rules
- Never store users' private keys or seed phrases.
- Validate all incoming requests.
- Enforce authentication and authorization on protected operations.
- Never trust frontend-provided transaction or authorization claims.
- Keep RPC credentials and other secrets on the server.

## 3. Database

The database stores and manages the application's persistent information.

### Responsibilities
- Store registered users and their wallet addresses.
- Store liquidity position records and relevant metadata.
- Store take-profit and stop-loss configurations.
- Store authorization records and their status.
- Store transaction execution attempts and results.
- Store notification records.
- Maintain relationships between users, positions and strategies.

### Proposed Technologies
- PostgreSQL.
- Supabase (managed PostgreSQL database).
- Database migrations for tracking schema changes.

### Important Security Rules
- Never store wallet seed phrases or private keys.
- Protect user-specific records from unauthorized access.
- Enforce database access policies.
- Validate data before saving it.
- Keep sensitive credentials outside the database records where possible.
- Maintain reliable backups.

## 4. Solana and Meteora Integration

This component connects the application to the Solana blockchain and Meteora DLMM protocol.

### Responsibilities
- Retrieve public wallet and on-chain account information.
- Discover and retrieve Meteora DLMM liquidity positions.
- Retrieve pool information, token balances and bin data.
- Prepare liquidity deposit, withdrawal and fee-claim instructions.
- Submit authorized transactions to Solana.
- Monitor transaction confirmations and on-chain account changes.
- Verify transaction outcomes using on-chain data.

### Technologies
- Solana Web3.js or the appropriate Solana SDK.
- Meteora DLMM SDK.
- Solana RPC provider.
- Phantom and Solflare wallet integrations.

### Important Security Rules
- Never expose private keys or RPC credentials.
- Require valid authorization before submitting fund-moving transactions.
- Verify transaction instructions and account addresses.
- Confirm transaction outcomes on-chain.
- Handle RPC failures, stale data and network interruptions safely.
- Do not assume Meteora position operators have withdrawal permissions until verified.

## 5. Monitoring Service

The monitoring service continuously monitors active liquidity strategies and detects when their configured exit conditions are met.

### Responsibilities
- Retrieve active take-profit and stop-loss strategies.
- Monitor relevant token prices and market capitalisation.
- Compare market data against configured trigger conditions.
- Validate price data freshness and reliability.
- Detect when an exit condition has been satisfied.
- Generate execution requests when valid triggers occur.
- Track strategy status and prevent duplicate trigger processing.
- Report monitoring failures and trigger events.

### Technologies
- TypeScript and Node.js.
- Background workers or scheduled jobs.
- Reliable market data APIs and price feeds.
- PostgreSQL for strategy configuration and status.

### Important Security and Reliability Rules
- Reject stale or unreliable market data.
- Never trigger an exit using an unverified price.
- Recheck trigger conditions before requesting execution.
- Prevent duplicate execution requests.
- Continue monitoring when users close their browsers.
- Recover active strategies after service restarts.
- Record trigger detection timestamps and relevant market data.

## 6. Execution Worker

The execution worker processes authorized liquidity management operations triggered by the monitoring service.

### Responsibilities
- Receive execution requests from the monitoring service.
- Validate execution requests before processing.
- Confirm that the relevant strategy remains active.
- Verify valid and unexpired withdrawal authorization.
- Recheck the selected liquidity position and its on-chain state.
- Prepare and submit Meteora DLMM withdrawal transactions.
- Track transaction signatures and confirmation status.
- Handle transaction failures and retry eligible operations.
- Record execution attempts, outcomes and error details.
- Prevent duplicate withdrawals through idempotency checks.

### Technologies
- TypeScript and Node.js.
- Background job processing.
- Solana SDK and Meteora DLMM SDK.
- PostgreSQL for execution records and status tracking.

### Important Security and Reliability Rules
- Never execute withdrawals without valid authorization.
- Never store users' private keys on the server.
- Verify on-chain transaction outcomes before retrying.
- Never blindly retry transactions with unknown outcomes.
- Revalidate position state before every retry.
- Enforce retry limits and appropriate delays.
- Prevent duplicate or conflicting execution requests.
- Record every execution attempt for auditing.

## 7. Authorization Layer

The authorization layer verifies and enforces permission for automated liquidity management operations.

### Responsibilities
- Establish valid user authorization for automated operations.
- Verify wallet ownership where required.
- Define the scope of permitted operations.
- Verify that authorization applies to the selected liquidity position.
- Check authorization status, expiration and revocation.
- Ensure withdrawals follow the user's configured strategy.
- Prevent unauthorized or out-of-scope transactions.
- Record authorization creation, updates and revocation.

### Proposed Technologies
- Solana wallet signing.
- Solana on-chain authorization mechanisms, subject to feasibility research.
- Backend authorization validation.
- PostgreSQL for authorization metadata and status.

### Important Security Rules
- Never store users' private keys or seed phrases.
- Never treat wallet connection as withdrawal authorization.
- Require explicit user approval for automated fund movement.
- Limit authorization to clearly defined operations and positions.
- Support authorization revocation.
- Enforce authorization independently of frontend checks.
- Never execute withdrawals if authorization cannot be verified.
- Do not enable unattended withdrawals until the mechanism has been technically verified and security-reviewed.

## 8. Notification Service

The notification service communicates important application events and transaction updates to users.

### Responsibilities
- Notify users when take-profit or stop-loss conditions are triggered.
- Notify users when withdrawal transactions are submitted.
- Report successful and failed transactions.
- Notify users when execution retries are attempted or exhausted.
- Notify users when authorization expires or is revoked.
- Report monitoring interruptions and recovery.
- Maintain notification history.
- Support in-app and email notifications.

### Proposed Technologies
- Next.js notification interface.
- Backend notification service.
- PostgreSQL for notification records.
- Email delivery provider (to be selected).

### Important Reliability Rules
- Distinguish trigger detection from transaction submission and confirmation.
- Never report a transaction as successful before on-chain confirmation.
- Avoid sending duplicate notifications for the same event.
- Record notification delivery status.
- Do not expose sensitive wallet information in notifications.

## 9. Component Communication

The application components communicate through APIs, database operations, blockchain RPC requests and background job processing.

### Main Communication Flows

1. The frontend sends requests to the backend API.
2. The backend validates requests and retrieves or stores information in the database.
3. The backend communicates with Solana and Meteora to retrieve blockchain information and prepare transactions.
4. The monitoring service retrieves active strategies and checks market conditions.
5. When a trigger is detected, the monitoring service creates an execution request.
6. The execution worker receives the request and verifies its validity.
7. The authorization layer verifies permission before any automated withdrawal.
8. The execution worker submits the authorized transaction to Solana.
9. The execution worker records the result in the database.
10. The notification service informs the user about the outcome.

### Communication Principles

- Use APIs for frontend-to-backend communication.
- Use secure database access for persistent information.
- Use background jobs for long-running tasks.
- Use Solana RPC for blockchain communication.
- Validate requests and responses between components.
- Handle network failures and service interruptions.
- Record important events for debugging and auditing.

## 10. Security Considerations

Security is a fundamental requirement across every component of the Meteora Liquidity Manager.

### Wallet Security
- Never request or store wallet seed phrases or private keys.
- Verify wallet ownership through cryptographic message signing where required.
- Clearly explain transactions before requesting wallet signatures.

### Authorization Security
- Require explicit authorization for automated fund movement.
- Restrict permissions to approved positions and operations.
- Support authorization expiration and revocation.
- Never execute withdrawals without verified authorization.

### Backend and Database Security
- Validate and sanitize all user inputs.
- Protect API endpoints against unauthorized access.
- Enforce database access controls and user-specific data isolation.
- Store API credentials and secrets securely.
- Never expose sensitive credentials in frontend code.

### Blockchain and Transaction Security
- Verify transaction instructions and account addresses.
- Confirm transaction outcomes using on-chain data.
- Prevent duplicate transaction execution.
- Handle RPC failures and uncertain transaction outcomes safely.
- Do not enable unattended withdrawals until the authorization mechanism has been verified and independently security-reviewed.

### Monitoring and Operational Security
- Reject stale or unreliable market data.
- Log important system events and execution attempts.
- Monitor service availability and failures.
- Maintain reliable database backups.
- Provide users with clear transaction and strategy status updates.