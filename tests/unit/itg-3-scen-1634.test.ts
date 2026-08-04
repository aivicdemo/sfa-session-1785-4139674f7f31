import { calculateRecommendationRelevanceScore } from '../../src/logic/it-1-br-3-1-1-1';

describe('推奨根拠の可視化機能', () => {
  // SCEN-1634
  test('[normal] 推奨妥当性スコア算出機能 - 提案数量が0の場合、スコア算出に正しく反映される', () => {
    // テスト入力データの準備
    const proposedQuantity = 0;
    const customerIndustry = '製造業';
    const dealAmount = 5000000; // 500万円
    const pastSuccessPatternMatchScore = 0.85;

    // AIRecommendationEngine の evaluatePatternRelevance メソッドをスタブ化
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.85)
    };

    // calculateRecommendationRelevanceScore() メソッドを実行
    const actualScore = calculateRecommendationRelevanceScore(
      {
        proposedQuantity,
        customerIndustry,
        dealAmount,
        pastSuccessPatternMatchScore
      },
      mockAIEngine
    );

    // 期待値の計算：
    // 提案数量が0のため、提案数量ファクターは 0 に設定される
    // 最終スコア = 過去成功事例マッチスコア × 顧客条件マッチ度 × 提案数量ファクター
    // = 0.85 × 顧客条件マッチ度係数 × 0
    // = 0.0
    const expectedScore = 0.0;

    // スコア値の検証
    expect(actualScore).toBe(expectedScore);

    // スコアが 0.0～1.0 の正規化された範囲内にあることを確認
    expect(actualScore).toBeGreaterThanOrEqual(0.0);
    expect(actualScore).toBeLessThanOrEqual(1.0);

    // AIEngine が正しく呼び出されたことを確認
    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalled();
  });
});