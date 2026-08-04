import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出と新規案件への提案アプローチ推奨機能", () => {
  test("SCEN-2066: evaluatePatternRelevance()がOpenAI APIで正常に応答した場合、スコアが資料に組み込まれる", async () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.87,
      }),
    };

    const newDealData = {
      customerIndustry: "IT",
      dealScale: "Large",
      decisionMakerCount: 3,
    };

    const successPattern = {
      patternId: "PATTERN-2024-001",
      applicableIndustry: "IT",
      successRate: 0.92,
    };

    const result = await evaluatePatternRelevance(
      newDealData,
      successPattern,
      mockAIEngine
    );

    expect(result).toBeDefined();
    expect(result.patternRelevanceScore).toBe(0.87);
    expect(result).toHaveProperty("patternRelevanceScore");
    expect(typeof result.patternRelevanceScore).toBe("number");
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      newDealData,
      successPattern
    );
  });
});