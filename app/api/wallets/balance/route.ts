
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { solanaConnection } from "@/lib/solana";

export async function POST(request: Request) {
  try {
    const { address } = await request.json();

    if (!address || typeof address !== "string") {
      return Response.json(
        { error: "Wallet address is required." },
        { status: 400 }
      );
    }

    const publicKey = new PublicKey(address);

    const lamports = await solanaConnection.getBalance(
      publicKey,
      "confirmed"
    );

    return Response.json({
        address,
        lamports: lamports.toString(),
        sol: Number(lamports) / LAMPORTS_PER_SOL,
    });
  } catch (error) {
    console.error("Solana balance API error:", error);
  
    return Response.json(
      { error: "Unable to retrieve wallet balance." },
      { status: 500 }
    );
  }
}
