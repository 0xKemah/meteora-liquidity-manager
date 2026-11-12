
import { NextRequest, NextResponse } from "next/server";
import { PublicKey } from "@solana/web3.js";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const address = body.address;

    if (typeof address !== "string" || !address.trim()) {
      return NextResponse.json(
        { valid: false, error: "Wallet address is required." },
        { status: 400 }
      );
    }

    try {
      const publicKey = new PublicKey(address.trim());

      return NextResponse.json({
        valid: true,
        address: publicKey.toBase58(),
      });
    } catch {
      return NextResponse.json(
        { valid: false, error: "Invalid Solana wallet address." },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { valid: false, error: "Invalid request body." },
      { status: 400 }
    );
  }
}
