import { describe, test, expect } from "@jest/globals";
import { executeSystemHealthCheck } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-244
  test("should throw exception when system health metric is negative", () => {
    const input = {
      systemUptimePercentage: -5,
      dataQualityScore: 95,
      aiInferenceAccuracy: 92,
    };

    expect(() => executeSystemHealthCheck(input)).toThrow(/System health metric must be non-negative/);
  });
});