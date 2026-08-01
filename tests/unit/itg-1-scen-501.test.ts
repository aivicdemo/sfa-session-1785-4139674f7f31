import { calculateInferenceAccuracyScore } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  test("SCEN-501: 信頼度がnullの場合、精度スコア算出でエラーをスロー", () => {
    const behaviorPatternAnalysisResult = {
      salesPersonId: "SP001",
      confidenceScore: null,
      analysisDate: "2024-01-15T10:30:00Z",
      patternType: "high_frequency_contact",
    };

    expect(() =>
      calculateInferenceAccuracyScore(behaviorPatternAnalysisResult)
    ).toThrow(/信頼度/);
  });
});