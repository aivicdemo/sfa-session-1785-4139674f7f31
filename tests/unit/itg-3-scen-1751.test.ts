import { getRecommendationReasonsWithEvidence } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  // SCEN-1751
  test("[edge] 推奨根拠の可視化機能 - 根拠に同値が並ぶとき同値の順序を保持して返す", () => {
    // 同一の関連度スコア（0.95）を持つ3件の類似パターンを特定の順序で返すスタブ
    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: "patternA",
          relevanceScore: 0.95,
          description: "顧客A向け提案パターン",
        },
        {
          patternId: "patternB",
          relevanceScore: 0.95,
          description: "顧客B向け提案パターン",
        },
        {
          patternId: "patternC",
          relevanceScore: 0.95,
          description: "顧客C向け提案パターン",
        },
      ]),
    };

    const recommendationInput = {
      customerId: "customer-001",
      industryType: "IT",
      companySize: "large",
      dealAmount: 5000000,
    };

    const result = getRecommendationReasonsWithEvidence(
      recommendationInput,
      mockAIRecommendationEngine
    );

    // 返却された根拠パターンのIDリストが元の順序を保持していることを確認
    const patternIds = result.reasons.map(
      (reason: { patternId: string }) => reason.patternId
    );

    expect(patternIds).toEqual(["patternA", "patternB", "patternC"]);

    // 各パターンの関連度スコアが同値（0.95）であることを確認
    result.reasons.forEach((reason: { relevanceScore: number }) => {
      expect(reason.relevanceScore).toBe(0.95);
    });

    // AIRecommendationEngineが正しく呼び出されたことを確認
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      recommendationInput
    );
  });
});