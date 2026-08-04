import { describe, test, expect, beforeEach } from "@jest/globals";
import { visualizeRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1678
  test("信頼度スコアが null のとき、ValidationError がスローされる", () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(null),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const recommendationInput = {
      recommendationId: "REC-20240115-001",
      recommendationContent: "提案アプローチ A を実行してください",
      relatedPatterns: [
        {
          patternId: "PAT-001",
          patternName: "成功パターン1",
          matchScore: 85,
        },
        {
          patternId: "PAT-002",
          patternName: "成功パターン2",
          matchScore: 72,
        },
      ],
      aiEngine: mockAIEngine,
    };

    expect(() =>
      visualizeRecommendationReasoning(recommendationInput)
    ).toThrow(/信頼度スコア/);
  });
});