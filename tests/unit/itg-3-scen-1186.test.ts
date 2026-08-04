import { evaluateProposalValidity } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1186
  test("顧客ニーズが0件の場合でも妥当性判定が実行される", async () => {
    // Arrange
    const dealId = "TEST-0001";
    const customerId = "CUST-001";
    const proposalContent = "標準パッケージA";
    const customerNeeds = [];

    // AIRecommendationEngineのスタブ
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.75,
        matchedPatterns: [
          {
            patternId: "PATTERN-001",
            successRate: 0.85,
            applicableCount: 12,
          },
        ],
        topSuccessPatterns: [
          {
            patternId: "TOP-PATTERN-001",
            description: "標準提案アプローチA",
            successRate: 0.88,
            applicableCount: 25,
          },
        ],
      }),
    };

    // Act
    const result = await evaluateProposalValidity(
      {
        dealId,
        customerId,
        proposalContent,
        customerNeeds,
      },
      mockAIRecommendationEngine
    );

    // Assert
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result.relevanceScore).toBeGreaterThanOrEqual(0.0);
    expect(result.relevanceScore).toBeLessThanOrEqual(1.0);
    expect(result.matchedPatterns).toBeDefined();
    expect(Array.isArray(result.matchedPatterns)).toBe(true);
    expect(result.topSuccessPatterns).toBeDefined();
    expect(Array.isArray(result.topSuccessPatterns)).toBe(true);
    expect(result.topSuccessPatterns.length).toBeGreaterThan(0);
    expect(result.topSuccessPatterns[0].successRate).toBe(0.88);
  });
});