import { describe, test, expect } from "@jest/globals";
import { decideSalesGuidancePolicy } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 営業担当者への指導方針決定機能", () => {
  // SCEN-502
  test("改善優先度ランク情報が空配列のとき、エラーが発生する", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const input = {
      dataQualityScore: 92,
      improvementPriorityRanks: [],
      improvementTargetItems: [
        {
          fieldName: "customer_phone",
          issueType: "missing_value",
          affectedRecordCount: 145,
        },
      ],
      aiEngine: mockAIEngine,
    };

    expect(() => {
      decideSalesGuidancePolicy(input);
    }).toThrow(/改善優先度ランク/);
  });
});