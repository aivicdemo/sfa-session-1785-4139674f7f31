import { generateRecommendation } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-762: AIRecommendationEngine.findSimilarPatterns が 0 件を返すとき、内部推奨パターンマスタから統計的上位パターンが返却される", async () => {
    // Arrange
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const internalPatternMaster = [
      {
        patternId: "PAT-001",
        successRate: 85,
        adoptionCount: 120,
        description: "IT業界・500万円予算向け標準提案",
      },
      {
        patternId: "PAT-002",
        successRate: 78,
        adoptionCount: 95,
        description: "IT業界・中期決定向け提案",
      },
      {
        patternId: "PAT-003",
        successRate: 72,
        adoptionCount: 60,
        description: "IT業界・迅速決定向け提案",
      },
    ];

    const newDealCondition = {
      industry: "IT",
      budget: 5000000,
      decisionPeriod: 3,
      customerId: "CUST-001",
    };

    // Act
    const result = await generateRecommendation(
      newDealCondition,
      mockAIEngine,
      internalPatternMaster
    );

    // Assert
    expect(result.recommendedPatterns).toHaveLength(3);
    expect(result.recommendedPatterns[0].patternId).toBe("PAT-001");
    expect(result.recommendedPatterns[0].successRate).toBe(85);
    expect(result.recommendedPatterns[0].adoptionCount).toBe(120);
    expect(result.recommendedPatterns[1].patternId).toBe("PAT-002");
    expect(result.recommendedPatterns[1].successRate).toBe(78);
    expect(result.recommendedPatterns[1].adoptionCount).toBe(95);
    expect(result.recommendedPatterns[2].patternId).toBe("PAT-003");
    expect(result.recommendedPatterns[2].successRate).toBe(72);
    expect(result.recommendedPatterns[2].adoptionCount).toBe(60);
    expect(result.reasoningBrief).toMatch(/過去の成功事例から上位パターンを選定/);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newDealCondition
    );
  });
});