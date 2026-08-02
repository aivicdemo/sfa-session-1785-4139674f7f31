import { describe, test, expect } from "@jest/globals";
import { decideDuplicateDetectionRulePriority } from "../../src/logic/it-1-br-2-2-1-1";

describe("顧客データの重複・不整合検出と正規化ルール適用による統合判定機能", () => {
  // SCEN-483
  test("品質リスク度合いが負の値のときにエラーが発生する", () => {
    const input = {
      qualityRiskScore: -0.5,
      detectionEfficiency: 0.8,
    };

    expect(() => decideDuplicateDetectionRulePriority(input)).toThrow(
      /品質リスク度合い/
    );
  });
});