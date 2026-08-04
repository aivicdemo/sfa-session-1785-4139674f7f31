import { evaluateRecommendationAccuracy } from "../../src/logic/it-1-br-3-3-2-1";

describe("推奨精度スコア算出機能", () => {
  // SCEN-2420: [edge] 推奨精度スコア算出機能 - 過去成功パターンが1件のときスコア計算に含まれる
  test("過去成功パターンが1件のときスコア計算に含まれる", () => {
    // テストセットアップ: AIRecommendationEngineのスタブを用意
    const mockAIEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue([
        {
          patternId: "pattern_001",
          customerIndustry: "製造業",
          budgetRange: "1000万円以上",
          decisionMakerCount: 3,
          successRate: 0.85,
        },
      ]),
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        patternId: "pattern_001",
        relevanceScore: 0.85,
      }),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    // 新規案件の入力データを準備
    const newDealInput = {
      customerIndustry: "製造業",
      budgetRange: "1000万円以上",
      decisionMakerCount: 3,
    };

    // 推奨精度スコア算出機能を実行
    const result = evaluateRecommendationAccuracy(newDealInput, mockAIEngine);

    // 期待結果の検証
    expect(result.accuracyScore).toBe(0.85);
    expect(result.patternCount).toBe(1);
    expect(result.relevanceScoreIncluded).toBe(true);
    expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledWith(newDealInput);
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      newDealInput,
      "pattern_001"
    );
  });
});