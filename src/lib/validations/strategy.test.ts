import { describe, it, expect } from "vitest";
import { createStrategySchema } from "./strategy";

describe("createStrategySchema", () => {
  it("accepts a valid take-profit strategy", () => {
    const result = createStrategySchema.safeParse({
      positionId: "position-123",
      strategyType: "take_profit",
      triggerMetric: "price",
      targetValue: 180,
    });

    expect(result.success).toBe(true);
  });

  it("rejects a negative target value", () => {
    const result = createStrategySchema.safeParse({
      positionId: "position-123",
      strategyType: "take_profit",
      triggerMetric: "price",
      targetValue: -180,
    });

    expect(result.success).toBe(false);
  });

  it("rejects a string instead of a number", () => {
    const result = createStrategySchema.safeParse({
      positionId: "position-123",
      strategyType: "take_profit",
      triggerMetric: "price",
      targetValue: "180",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an unsupported strategy type", () => {
    const result = createStrategySchema.safeParse({
      positionId: "position-123",
      strategyType: "take_all",
      triggerMetric: "price",
      targetValue: 180,
    });

    expect(result.success).toBe(false);
  });
});
