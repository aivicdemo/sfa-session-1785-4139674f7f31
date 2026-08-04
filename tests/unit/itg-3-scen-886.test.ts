import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨根拠データの提示機能", () => {
  test("SCEN-886: 成功パターン抽出データが1件のとき単一パターンが根拠として提示される", async () => {
    const mockFindSimilarPatterns = jest.fn().mockResolvedValue([
      {
        patternId: "PAT-001",
        patternName: "テレビ会議による段階的提案",
        matchScore: 0.92,
      },
    ]);

    const mockExplainRecommendationReasoning = jest
      .fn()
      .mockResolvedValue(
        "過去12ヶ月で同一顧客層への提案成功率87%を記録したパターン"
      );

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: mockFindSimilarPatterns,
      explainRecommendationReasoning: mockExplainRecommendationReasoning,
      evaluatePatternRelevance: jest.fn(),
    };

    const newDealInput = {
      customerSize: "mid-market",
      industry: "manufacturing",
      decisionMakerCount: 3,
    };

    const recommendation = await generateRecommendation(
      newDealInput,
      mockAIEngine
    );

    expect(recommendation.reasoning.patterns).toHaveLength(1);
    expect(recommendation.reasoning.patterns[0].patternId).toBe("PAT-001");
    expect(recommendation.reasoning.patterns[0].explanation).toContain(
      "過去12ヶ月で同一顧客層への提案成功率87%を記録したパターン"
    );
    expect(recommendation.reasoning.patterns[0].matchScore).toBeGreaterThanOrEqual(
      0.92
    );
    expect(recommendation.reasoning.patterns[0].matchScore).toBeLessThanOrEqual(
      0.95
    );
  });
});