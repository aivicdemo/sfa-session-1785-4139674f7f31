import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { calculateAiInferenceAccuracyScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-755: [error] AIエージェント推論精度評価機能 - AIエージェント推論精度スコア算出時に顧客対応パターンが業務ルール違反のときエラーになる
  it("should throw BUSINESS_RULE_VIOLATION_DETECTED when customer response pattern violates business rules", () => {
    const violatingPattern = {
      salesPersonId: "SP-001",
      salesPersonAuthority: "standard",
      customerResponseType: "contract_approval",
      contractAmount: 1000000,
      timestamp: new Date("2024-01-15T10:30:00Z"),
    };

    expect(() =>
      calculateAiInferenceAccuracyScore(violatingPattern)
    ).toThrow(/BUSINESS_RULE_VIOLATION_DETECTED/);
  });
});