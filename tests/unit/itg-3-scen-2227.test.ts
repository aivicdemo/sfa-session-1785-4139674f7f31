import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出と提案アプローチ推奨機能", () => {
  // SCEN-2227
  test("過去商談が0件のとき推奨処理が正常に完了する", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(
        new Error("No historical data available")
      ),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockPatternMaster = [
      {
        stage: "初期接触",
        industry: "IT",
        recommendedApproach: "丁寧なヒアリング提案",
        successRate: 0.78,
        rationale: "統計的に成功率の高いアプローチです",
      },
      {
        stage: "初期接触",
        industry: "IT",
        recommendedApproach: "ニーズ探索型提案",
        successRate: 0.72,
        rationale: "統計的に成功率の高いアプローチです",
      },
    ];

    const newDealInput = {
      customerName: "テスト顧客A",
      industry: "IT",
      budget: 5000000,
      stage: "初期接触",
    };

    const result = await generateRecommendation(
      newDealInput,
      mockAIEngine,
      mockPatternMaster
    );

    expect(result).toEqual({
      status: "success",
      recommendedApproach: "丁寧なヒアリング提案",
      rationale: "統計的に成功率の高いアプローチです",
      confidence: 78,
      source: "pattern_master",
      historicalCasesCount: 0,
    });
    expect(result.status).toBe("success");
    expect(result.source).toBe("pattern_master");
    expect(result.confidence).toBe(78);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalled();
  });
});