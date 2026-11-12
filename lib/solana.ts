
import { Connection, clusterApiUrl } from "@solana/web3.js";

const rpcUrl =
  process.env.SOLANA_RPC_URL || clusterApiUrl("mainnet-beta");

export const solanaConnection = new Connection(rpcUrl, "confirmed");
