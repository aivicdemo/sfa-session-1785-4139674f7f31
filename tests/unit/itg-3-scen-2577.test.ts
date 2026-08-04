import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  test("SCEN-2577: 同じ推奨内容IDで2回実行したとき、同じ根拠が表示される", () => {
    const recommendationId = "REC-20250115-001";
    const expectedReasoningText =
      "顧客規模：中堅企業、業種：製造、予算規模：500万円以上、導入期間：3ヶ月以内の過去成功パターン5件に基づく推奨";

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: recommendationId,
        proposalApproach: "標準提案アプローチ",
        patternId: "PAT-001",
        similarityScore: 0.92,
        successCaseReferences: ["CASE-001", "CASE-002", "CASE-003", "CASE-004", "CASE-005"],
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        recommendationId: recommendationId,
        reasoningText: expectedReasoningText,
      }),
      evaluatePatternRelevance: jest.fn(),
    };

    const dealConditions = {
      customerId: "CUST-123",
      dealId: "DEAL-456",
      customerScale: "中堅企業",
      industry: "製造",
      budgetSize: "500万円以上",
      implementationPeriod: "3ヶ月以内",
    };

    return (async () => {
      const firstResult = await explainRecommendationReasoning(
        recommendationId,
        mockAIRecommendationEngine,
      );

      const secondResult = await explainRecommendationReasoning(
        recommendationId,
        mockAIRecommendationEngine,
      );

      expect(firstResult.recommendationId).toBe(recommendationId);
      expect(secondResult.recommendationId).toBe(recommendationId);

      expect(firstResult.recommendationId).toBe(secondResult.recommendationId);

      expect(firstResult.reasoningText).toBe(expectedReasoningText);
      expect(secondResult.reasoningText).toBe(expectedReasoningText);

      expect(firstResult.reasoningText).toBe(secondResult.reasoningText);

      expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(
        2,
      );
      expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenNthCalledWith(
        1,
        recommendationId,
      );
      expect(mockAIRecommendationEngine.explainRecommendationReasoning).toHaveBeenNthCalledWith(
        2,
        recommendationId,
      );
    })();
  });
});