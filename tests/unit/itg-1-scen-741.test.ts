import { calculateInferenceAccuracyScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-741
  test("推論精度スコア算出時に提案内容が空文字のときValidationErrorをスロー", () => {
    const input = {
      proposalContent: "",
      standardProcessAlignment: 0.85,
      customerResponsePattern: 0.9,
      successPatternMatch: 0.8,
    };

    expect(() => calculateInferenceAccuracyScore(input)).toThrow(/提案内容は必須項目です/);
  });
});