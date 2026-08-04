import { evaluateDataQualityScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-518: データ品質スコア算出機能 - 検証対象データが1件のときスコアが正確に算出される", () => {
    // データ品質スコア算出機能のテストセットアップを初期化する
    const dealRecord = {
      dealId: "DEAL-001",
      customerName: "テスト顧客株式会社",
      dealAmount: 5000000,
      industry: "製造業",
      proposalContent: "生産管理システム導入提案",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    };

    // AIRecommendationEngineのスタブを設定
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 85,
        matchedPatterns: 1,
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    // データ品質スコア算出機能を呼び出し
    const result = evaluateDataQualityScore(
      [dealRecord],
      mockAIEngine
    );

    // 入力データ件数が1件として記録される
    expect(result.dataCount).toBe(1);

    // 完全性スコアは入力データの必須フィールド充足率を反映した値
    // 必須フィールド: dealId, customerName, dealAmount, industry, proposalContent (5個)
    // すべて存在するため 5/5 = 100%
    expect(result.completenessScore).toBe(100);

    // 妥当性スコアはAIエンジンのevaluatePatternRelevanceから取得した値
    expect(result.validityScore).toBe(85);

    // 一貫性スコアはデータ内の論理矛盾がないため満点
    expect(result.consistencyScore).toBe(100);

    // 総合スコアが各部分スコアの加重平均として算出される
    // 完全性: 100 (30%), 妥当性: 85 (40%), 一貫性: 100 (30%)
    // 総合: 100*0.3 + 85*0.4 + 100*0.3 = 30 + 34 + 30 = 94
    expect(result.overallScore).toBe(94);

    // スコアが0～100の範囲内である
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);

    // AIEngineのevaluatePatternRelevanceが呼び出されたことを確認
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});