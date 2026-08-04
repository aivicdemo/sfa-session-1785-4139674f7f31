import { describe, test, expect, beforeEach } from "@jest/globals";
import { generateRecommendationExplanation } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-583
  test("推奨根拠説明文生成機能 - 同じ推奨提案で2回説明文生成したときき同一の根拠説明が返される", () => {
    const recommendationId = "REC-20260801-001";
    const expectedExplanation =
      "顧客の業界は製造業で、過去の成功事例では同業界向けにクラウド導入提案が成約率85%で最も効果的です。現案件の条件（従業員数500-1000名、IT予算月額100万円以上）もマッチしており、同じアプローチを推奨します。";

    let explainReasoningCallCount = 0;

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendationId: recommendationId,
        proposalApproach: "クラウド導入提案",
        confidenceScore: 85,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(() => {
        explainReasoningCallCount++;
        return expectedExplanation;
      }),
      evaluatePatternRelevance: jest.fn(),
    };

    const dealCondition = {
      customerId: "CUST-001",
      customerName: "製造企業A",
      industry: "製造業",
      employeeCount: 750,
      itBudgetMonthly: 1500000,
      dealId: "DEAL-20260801-001",
    };

    const firstExplanation = generateRecommendationExplanation(
      dealCondition,
      mockAIRecommendationEngine
    );

    const secondExplanation = generateRecommendationExplanation(
      dealCondition,
      mockAIRecommendationEngine
    );

    expect(firstExplanation).toBe(expectedExplanation);
    expect(secondExplanation).toBe(expectedExplanation);
    expect(firstExplanation).toBe(secondExplanation);
    expect(explainReasoningCallCount).toBe(2);
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(
      2
    );
  });
});