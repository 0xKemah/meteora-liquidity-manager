# Technical Feasibility Assessment

**Project:** Meteora Liquidity Manager
**Date:** November 6, 2026
**Status:** Initial investigation

## 1. Core Technical Requirement

Users must be able to configure a take-profit or stop-loss strategy, authorize the action once, and allow the platform to withdraw 100% of the selected Meteora DLMM position without requiring the user to remain online.

## 2. Confirmed Findings

- Meteora DLMM supports liquidity removal through its TypeScript SDK.
- The SDK's `removeLiquidity()` method accepts a user, position, bin range and withdrawal percentage.
- A withdrawal of 10,000 basis points represents 100% of the position's liquidity.
- DLMM PositionV2 accounts contain an owner field.
- DLMM PositionV2 accounts also contain a permissionless-operation bitmask.
- Meteora documents position-operator and permissionless-operation instructions.
- Solana supports Program Derived Addresses (PDAs) and Cross-Program Invocations (CPIs).

## 3. Potential Authorization Approaches

### Approach A: Meteora position delegation
Investigate whether an existing position can authorize an operator to withdraw liquidity.

### Approach B: Custom Solana program
Investigate whether a custom program can safely control or authorize withdrawals through CPI.

### Approach C: User-signed withdrawal
Use a conventional wallet signature when the trigger is reached. This is the fallback if unattended execution cannot be safely implemented.

## 4. Unresolved Technical Questions

1. Which DLMM operations are supported by permissionless-operation bits?
2. Can an operator withdraw liquidity from an existing position?
3. Can users assign and revoke position operators?
4. Can a custom Solana program invoke DLMM withdrawal instructions through CPI?
5. How can authorization be restricted to one position and one withdrawal action?
6. How can authorization expire or be revoked?
7. How will the execution service prevent duplicate withdrawals?

## 5. Preliminary Architecture

- Frontend: Next.js, React and TypeScript.
- Backend: Next.js API services.
- Database: PostgreSQL / Supabase.
- Blockchain: Solana.
- Liquidity protocol: Meteora DLMM.
- Monitoring: Background market-monitoring service.
- Execution: Background transaction-execution worker.
- Authorization: To be determined after further protocol research.

## 6. Security Requirements

- Never store users' unrestricted private keys.
- Require explicit user authorization.
- Enforce authorization limits on-chain where possible.
- Support revocation and expiration.
- Revalidate position state and market data before execution.
- Reconcile transaction outcomes before retrying.
- Maintain a complete execution audit trail.

## 7. Current Decision

Unattended withdrawals remain a product requirement but are not yet technically validated.

No automated fund movement will be enabled until the authorization mechanism is proven, tested and independently security-reviewed.

## 8. New Finding: Native DLMM Position Operator

Further investigation of Meteora's published DLMM IDL confirms that the PositionV2 account contains:

- `owner`: Public key of the position owner.
- `operator`: Public key assigned as the position operator.
- `permissionless_operation_bits`: Flags controlling selected permissionless operations.

The `update_position_operator` instruction allows the position owner to authorize a change of operator.

The `remove_liquidity_by_range2` instruction requires a transaction signer identified as `sender`.

### Architectural Implication

Meteora's native operator mechanism may provide a way for the platform's execution service to perform authorized position operations without storing the user's private key.

This could eliminate the need to develop a custom Solana authorization program.

### Outstanding Verification

The published IDL does not establish whether the assigned operator is authorized to execute liquidity withdrawals.

This must be validated through official documentation, transaction simulation, or controlled testing before implementation.

### Updated Technical Decision

Investigate native Meteora position delegation before considering a custom Solana program.

Do not enable unattended withdrawals until the authorization mechanism has been demonstrated to work safely.
