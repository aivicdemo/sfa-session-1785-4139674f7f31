import { validateRecommendationContent } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-2873: 改善指導の優先度が負の整数のとき、エラーを返す", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const improvementGuidance = {
      guidanceId: "guid_001",
      recommendationId: "rec_001",
      priority: -1,
      description: "提案内容の修正が必要",
      action: "顧客ニーズの再ヒアリング",
      targetDate: "2024-02-15",
    };

    const recommendationContent = {
      recommendationId: "rec_001",
      customerId: "cust_001",
      proposalApproach: "標準提案アプローチ",
      proposedTiming: "2024-02-10",
      proposedQuantity: 100,
      confidenceScore: 85,
      improvementGuidance: [improvementGuidance],
    };

    expect(() =>
      validateRecommendationContent(recommendationContent, mockAIRecommendationEngine)
    ).toThrow(/改善指導の優先度は0以上の整数である必要があります/);

    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});