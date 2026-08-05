import { describe, test, expect } from "@jest/globals";
import { determineImprovementInstructionPriority } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-243: 乖離パターン分類結果がない営業担当者に対して優先順位を決定しようとするときエラーになる", () => {
    const salesUserId = "sales_user_999";
    const deviationPatternClassifications = [
      {
        salesUserId: "sales_user_001",
        deviationPatternId: "pattern_001",
        deviationPatternName: "初回接触遅延",
        frequency: 5,
        impactScore: 0.75,
      },
      {
        salesUserId: "sales_user_002",
        deviationPatternId: "pattern_002",
        deviationPatternName: "提案内容不適切",
        frequency: 3,
        impactScore: 0.85,
      },
    ];

    expect(() =>
      determineImprovementInstructionPriority(
        salesUserId,
        deviationPatternClassifications
      )
    ).toThrow(/営業担当者.*乖離パターン分類結果/);
  });
});