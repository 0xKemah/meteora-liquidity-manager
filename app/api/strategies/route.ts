import { NextResponse } from "next/server";
import { createStrategySchema } from "@/src/lib/validations/strategy";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = createStrategySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "The strategy data is invalid.",
            details: result.error.flatten(),
          },
        },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Strategy validation successful.",
      data: result.data,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_JSON",
          message: "The request body must contain valid JSON.",
        },
      },
      { status: 400 },
    );
  }
}
