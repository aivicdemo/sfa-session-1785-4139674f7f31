import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import { displayRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

interface AIRecommendationEngine {
  evaluatePatternRelevance: jest.Mock<number>;
  explainRecommendationReasoning: jest.Mock<string>;
  generateRecommendation?: jest.Mock;
  findSimilarPatterns?: jest.Mock;
}

interface RecommendationResult {
  recommendationId: string;
  confidenceScore: number;
  proposedApproach: string;
  isEligibleForReasonDisplay?: boolean;
}

describe("AIエージェント推奨内容の根拠表示機能", () => {
  let mockAIEngine: AIRecommendationEngine;

  beforeEach(() => {
    mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(70.1),
      explainRecommendationReasoning: jest
        .fn()
        .mockReturnValue("過去の類似案件データから抽出した成功パターンに基づいて、当該顧客への提案アプローチを推奨します。"),
    };
  });

  // SCEN-2684
  test("信頼度スコア70.1%のとき根拠表示対象として処理され、説明文が生成される", () => {
    const recommendationInput = {
      customerId: "CUST_001",
      dealId: "DEAL_20240115_001",
      industryType: "製造業",
      companySize: "medium",
      currentStage: "proposal",
    };

    const confidenceScoreFromEngine = mockAIEngine.evaluatePatternRelevance();
    expect(confidenceScoreFromEngine).toBe(70.1);

    const recommendationResult: RecommendationResult = {
      recommendationId: "REC_20240115_001",
      confidenceScore: confidenceScoreFromEngine,
      proposedApproach: "顧客ニーズに基づいた段階的な提案戦略",
      isEligibleForReasonDisplay: undefined,
    };

    const result = displayRecommendationReasoning(
      recommendationResult,
      mockAIEngine
    );

    expect(result.isEligibleForReasonDisplay).toBe(true);

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(
      1
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      recommendationResult
    );

    const generatedReasoningText =
      mockAIEngine.explainRecommendationReasoning(recommendationResult);
    expect(generatedReasoningText).toBeDefined();
    expect(typeof generatedReasoningText).toBe("string");
    expect(generatedReasoningText.length).toBeGreaterThan(0);

    expect(result.reasoningExplanation).toBe(generatedReasoningText);
  });
});