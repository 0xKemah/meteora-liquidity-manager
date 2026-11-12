
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
        { status: 400 }
      );
    }

    let walletPublicKey: PublicKey;

    try {
      walletPublicKey = new PublicKey(address.trim());
    } catch {
      return NextResponse.json(
        { error: "Invalid Solana wallet address." },
        { status: 400 }
      );
    }

    const positions = await DLMM.getAllLbPairPositionsByUser(
      solanaConnection,
      walletPublicKey
    );

    const result = Array.from(positions.entries()).map(
      ([poolAddress, positionInfo]) => ({
        poolAddress,
        positions: positionInfo.lbPairPositionsData.map((position) => ({
          positionAddress: position.publicKey.toBase58(),
          owner: position.positionData.owner.toBase58(),
          lowerBinId: position.positionData.lowerBinId,
          upperBinId: position.positionData.upperBinId,
          totalXAmount: position.positionData.totalXAmount,
          totalYAmount: position.positionData.totalYAmount,
          feeX: position.positionData.feeX.toString(),
          feeY: position.positionData.feeY.toString(),
        })),
      })
    );

    return NextResponse.json({
      wallet: walletPublicKey.toBase58(),
      totalPools: result.length,
      pools: result,
    });
  } catch (error) {
    console.error("DLMM positions API error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve DLMM positions." },
      { status: 500 }
    );
  }
}
