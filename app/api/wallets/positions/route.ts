import { NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";
import DLMM from "@meteora-ag/dlmm";
import { solanaConnection } from "@/lib/solana";

export async function POST(request: Request) {
  try {
    const { address } = await request.json();

    if (typeof address !== "string" || !address.trim()) {
      return NextResponse.json(
        { error: "Wallet address is required." },
        { status: 400 },
      );
    }

    let walletPublicKey: PublicKey;

    try {
      walletPublicKey = new PublicKey(address.trim());
    } catch {
      return NextResponse.json(
        { error: "Invalid Solana wallet address." },
        { status: 400 },
      );
    }

    const positions = await DLMM.getAllLbPairPositionsByUser(
      solanaConnection,
      walletPublicKey,
    );

    const result = Array.from(positions.entries()).map(
      ([poolAddress, positionInfo]) => ({
        poolAddress,
        tokenXDecimals: positionInfo.tokenX.mint.decimals,
        tokenYDecimals: positionInfo.tokenY.mint.decimals,
        positions: positionInfo.lbPairPositionsData.map((position) => ({
          tokenXDecimals: positionInfo.tokenX.mint.decimals,
          tokenYDecimals: positionInfo.tokenY.mint.decimals,
          tokenXMint: positionInfo.tokenX.mint.address.toBase58(),
          tokenYMint: positionInfo.tokenY.mint.address.toBase58(),
          positionAddress: position.publicKey.toBase58(),
          owner: position.positionData.owner.toBase58(),
          lowerBinId: position.positionData.lowerBinId,
          upperBinId: position.positionData.upperBinId,
          totalXAmount: position.positionData.totalXAmount,
          totalYAmount: position.positionData.totalYAmount,
          feeX: position.positionData.feeX.toString(),
          feeY: position.positionData.feeY.toString(),
        })),
      }),
    );
    const mintAddresses = Array.from(
      new Set(
        result.flatMap((pool) =>
          pool.positions.flatMap((position) => [
            position.tokenXMint,
            position.tokenYMint,
          ]),
        ),
      ),
    );

    const metadataResponse = await fetch(
      `https://api.jup.ag/tokens/v2/search?query=${mintAddresses.join(",")}`,
    );

    const tokenMetadata = metadataResponse.ok
      ? await metadataResponse.json()
      : [];
    const metadataByMint = new Map(
      tokenMetadata.map(
        (token: {
          id: string;
          name?: string;
          symbol?: string;
          icon?: string;
          decimals?: number;
          usdPrice?: number;
          mcap?: number;
        }) => [token.id, token],
      ),
    );

    const enrichedResult = result.map((pool) => ({
      ...pool,
      positions: pool.positions.map((position) => ({
        ...position,
        tokenX: metadataByMint.get(position.tokenXMint) ?? null,
        tokenY: metadataByMint.get(position.tokenYMint) ?? null,
      })),
    }));

    return NextResponse.json({
      wallet: walletPublicKey.toBase58(),
      totalPools: result.length,
      pools: enrichedResult,
    });
  } catch (error) {
    console.error("DLMM positions API error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve DLMM positions." },
      { status: 500 },
    );
  }
}
