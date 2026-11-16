import { z } from "zod";

export const createStrategySchema = z.object({
  positionId: z.string().min(1, "Position ID is required"),

  strategyType: z.enum(["take_profit", "stop_loss"]),

  triggerMetric: z.enum(["price", "market_cap"]),

  targetValue: z.number().positive("Target value must be greater than zero"),
});
