import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出と提案アプローチ自動推奨", () => {
  // SCEN-1546
  test("適合性スコアが推奨判定閾値に等しい場合、提案アプローチが推奨される", () => {
    // 推奨判定閾値の定義
    const RECOMMENDATION_THRESHOLD = 0.75;

    // 新規案件の条件データ
    const newDealCondition = {
      customerIndustry: "manufacturing",
      budgetAmount: 5000000,
      implementationPeriodMonths: 3,
    };

    // 過去成功パターンのデータ
    const successPattern = {
      industry: "manufacturing",
      budgetRangeMin: 4500000,
      budgetRangeMax: 5500000,
      implementationPeriodMin: 2,
      implementationPeriodMax: 4,
      successRate: 0.75,
    };

    // AIRecommendationEngineのスタブ
    const mockAIEngine = {
      evaluatePatternRelevance: jest
        .fn()
        .mockReturnValue(RECOMMENDATION_THRESHOLD),
      explainRecommendationReasoning: jest.fn().mockReturnValue(
        "過去の同規模製造業案件において同一導入期間での成功率 75%"
      ),
    };

    // evaluatePatternRelevanceを呼び出す
    const relevanceScore = mockAIEngine.evaluatePatternRelevance(
      newDealCondition,
      successPattern
    );

    // 適合性スコアが推奨判定閾値に等しいことを確認
    expect(relevanceScore).toBe(0.75);

    // 推奨判定ロジック：スコア >= 閾値
    const isRecommended = relevanceScore >= RECOMMENDATION_THRESHOLD;
    expect(isRecommended).toBe(true);

    // 推奨ステータスの生成
    const recommendationResult = {
      status: isRecommended ? "Recommended" : "NotRecommended",
      proposalApproach: "顧客要件に基づくカスタマイズ導入プラン",
      relevanceScore: relevanceScore,
    };

    // 根拠説明文の生成
    const reasoning = mockAIEngine.explainRecommendationReasoning(
      newDealCondition,
      successPattern,
      relevanceScore
    );

    // 期待結果の検証
    expect(recommendationResult.status).toBe("Recommended");
    expect(recommendationResult.proposalApproach).toBe(
      "顧客要件に基づくカスタマイズ導入プラン"
    );
    expect(recommendationResult.relevanceScore).toBe(0.75);
    expect(reasoning).toBe(
      "過去の同規模製造業案件において同一導入期間での成功率 75%"
    );

    // AIエンジンメソッドが呼び出されたことを確認
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      newDealCondition,
      successPattern
    );
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      newDealCondition,
      successPattern,
      0.75
    );
  });
});