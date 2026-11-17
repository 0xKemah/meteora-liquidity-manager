import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("wallets").select("id").limit(1);

  if (error) {
    console.error("Database connection failed:", error);

    return NextResponse.json(
      { status: "error", message: "Database query failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    status: "connected",
    message: "Supabase database query successful",
    rowsReturned: data.length,
  });
}
