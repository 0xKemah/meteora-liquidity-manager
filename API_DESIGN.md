# API Design — Meteora Liquidity Manager

## 1. Overview

This document defines the proposed API structure for Meteora Liquidity Manager.

The API connects the frontend to the backend, database, Solana blockchain and Meteora DLMM protocol.

The API will initially be implemented using Next.js Route Handlers.

## 2. API Design Principles

- Use RESTful API conventions.
- Use JSON for request and response bodies.
- Validate all incoming requests.
- Authenticate users before allowing access to private resources.
- Verify ownership before permitting position management.
- Never trust user IDs or wallet ownership claims supplied by the frontend.
- Preserve transaction and execution history.
- Never treat a database record as proof of on-chain authorization.

## 3. Wallet and Discovery API

| Method | Endpoint                         | Authentication | Purpose                                         |
| ------ | -------------------------------- | -------------- | ----------------------------------------------- |
| GET    | /api/wallets/{address}/positions | Public         | Retrieve public DLMM positions                  |
| POST   | /api/wallets/nonce               | Public         | Generate a wallet authentication challenge      |
| POST   | /api/wallets/verify              | Public         | Verify wallet signature and establish a session |

### Wallet Discovery

Example:
GET /api/wallets/{address}/positions

Input:

- address: Solana wallet address.

Successful response:

- success
- walletAddress
- positions
- total

An empty positions array is a successful result when a valid wallet has no supported DLMM positions.

## 4. Portfolio API

| Method | Endpoint                 | Authentication | Purpose                         |
| ------ | ------------------------ | -------------- | ------------------------------- |
| GET    | /api/portfolio           | Required       | Retrieve portfolio overview     |
| GET    | /api/portfolio/positions | Required       | Retrieve owned positions        |
| GET    | /api/portfolio/analytics | Required       | Retrieve portfolio analytics    |
| GET    | /api/portfolio/history   | Required       | Retrieve historical performance |

The backend must identify the authenticated user from their verified session.

## 5. Position Management API

| Method | Endpoint                          | Authentication | Purpose                            |
| ------ | --------------------------------- | -------------- | ---------------------------------- |
| GET    | /api/positions/{id}               | Required       | Retrieve position details          |
| POST   | /api/positions                    | Required       | Register or synchronise a position |
| POST   | /api/positions/{id}/add-liquidity | Required       | Initiate adding liquidity          |
| POST   | /api/positions/{id}/withdraw      | Required       | Initiate liquidity withdrawal      |
| POST   | /api/positions/{id}/claim-fees    | Required       | Initiate fee claiming              |

Position management requires verified ownership and appropriate transaction authorization.

Blockchain operations must receive the required wallet signature or valid delegated authorization.

Withdrawing liquidity must not automatically delete historical position records.

## 6. Exit Strategy API

| Method | Endpoint             | Authentication | Purpose                         |
| ------ | -------------------- | -------------- | ------------------------------- |
| GET    | /api/strategies      | Required       | Retrieve user strategies        |
| POST   | /api/strategies      | Required       | Create an exit strategy         |
| GET    | /api/strategies/{id} | Required       | Retrieve strategy details       |
| PATCH  | /api/strategies/{id} | Required       | Update strategy configuration   |
| DELETE | /api/strategies/{id} | Required       | Deactivate or remove a strategy |

### Strategy Rules

- Strategy type must be take_profit or stop_loss.
- Trigger metric must be price or market_cap.
- Each strategy must use only one trigger metric.
- Each strategy must belong to a liquidity position.
- Users can only manage strategies belonging to their own positions.
- Execution and authorization history must be preserved.

## 7. Execution and Authorization API

| Method | Endpoint                        | Authentication | Purpose                               |
| ------ | ------------------------------- | -------------- | ------------------------------------- |
| GET    | /api/executions                 | Required       | Retrieve execution history            |
| GET    | /api/executions/{id}            | Required       | Retrieve execution details            |
| POST   | /api/executions/{id}/cancel     | Required       | Request cancellation of a pending job |
| POST   | /api/authorizations             | Required       | Register an on-chain authorization    |
| POST   | /api/authorizations/{id}/revoke | Required       | Revoke an authorization               |

### Execution Rules

- Only valid, authorized strategies can trigger execution.
- The execution worker must verify authorization before attempting withdrawal.
- Trigger data must be checked for freshness and validity.
- Failed transactions must be reconciled before retrying.
- Idempotency must prevent duplicate execution.
- Every execution attempt must be recorded.
- Execution status must distinguish pending, submitted, confirmed and failed states.

Unattended withdrawals must remain disabled until the on-chain authorization mechanism has been technically validated and security-reviewed.

## 8. Notification API

| Method | Endpoint                    | Authentication | Purpose                        |
| ------ | --------------------------- | -------------- | ------------------------------ |
| GET    | /api/notifications          | Required       | Retrieve user notifications    |
| PATCH  | /api/notifications/{id}     | Required       | Mark a notification as read    |
| POST   | /api/notifications/read-all | Required       | Mark all notifications as read |

Users must only access their own notifications.

## 9. HTTP Status Codes

| Code | Meaning               | Example                                         |
| ---- | --------------------- | ----------------------------------------------- |
| 200  | OK                    | Successful data retrieval                       |
| 201  | Created               | Strategy successfully created                   |
| 400  | Bad Request           | Invalid wallet address                          |
| 401  | Unauthorized          | User is not authenticated                       |
| 403  | Forbidden             | User attempts to access another user's resource |
| 404  | Not Found             | Requested position does not exist               |
| 409  | Conflict              | Duplicate execution request                     |
| 422  | Unprocessable Entity  | Valid request format but invalid business rules |
| 500  | Internal Server Error | Unexpected backend failure                      |
| 503  | Service Unavailable   | Required external service is unavailable        |

## 10. Standard Response Format

Successful response:

{
"success": true,
"data": {},
"message": "Request completed successfully"
}

Error response:

{
"success": false,
"error": {
"code": "INVALID_REQUEST",
"message": "The supplied wallet address is invalid"
}
}

## 11. Authentication and Security

- Public wallet discovery does not require authentication.
- Private portfolio operations require an authenticated session.
- Wallet ownership must be verified through cryptographic signature verification.
- Every private resource must undergo server-side ownership checks.
- RLS must protect user-specific database records.
- Service-role credentials must never be exposed to the frontend.
- Blockchain authorization must be verified independently of database records.
- API endpoints must validate input and enforce appropriate rate limits.

## 12. External Services

The backend will communicate with:

- Supabase: database and authentication infrastructure.
- Solana RPC: blockchain data and transaction submission.
- Meteora DLMM SDK: liquidity position discovery and management.
- Price data providers: price and market-cap monitoring.

## 13. Implementation Notes

This document describes the proposed API architecture, not completed endpoints.

Endpoint request schemas, response schemas, validation rules and transaction workflows will be refined during implementation.

The Meteora DLMM delegated withdrawal mechanism remains subject to technical feasibility validation.
