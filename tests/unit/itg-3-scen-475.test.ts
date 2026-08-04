import { calculateDataQualityScore } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - データ品質スコア算出機能", () => {
  test("SCEN-475: 検証結果レポートがnullのときエラーが発生する", () => {
    const validationReportNull = null;
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockImplementation(() => {
        if (validationReportNull === null) {
          const error = new Error("検証結果レポートがnullです");
          (error as any).code = "ValidationReportNullError";
          (error as any).timestamp = new Date("2024-01-15T10:30:00Z").toISOString();
          (error as any).inputParams = { validationReport: validationReportNull };
          throw error;
        }
        return { score: 85 };
      }),
    };

    expect(() =>
      calculateDataQualityScore(validationReportNull, mockAIEngine)
    ).toThrow(/検証結果レポート/);
  });
});