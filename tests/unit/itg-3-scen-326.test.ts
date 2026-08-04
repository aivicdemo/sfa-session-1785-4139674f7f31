import { evaluateRecommendationAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-326
  test('[normal] 推奨精度検証機能 - 推奨精度が設定閾値を超えた場合、良好と判定される', () => {
    // 前提: 設定閾値は0.80
    const accuracyThreshold = 0.80;
    
    // テスト用の商談条件データ
    const dealCondition = {
      customerIndustry: '製造業',
      productCategory: '生産管理システム',
      budgetAmount: 5000000
    };
    
    // AIRecommendationEngineのevaluatePatternRelevanceをモック化
    // スコア0.85を返すように設定
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.85)
    };
    
    // 推奨精度検証機能を実行
    const result = evaluateRecommendationAccuracy(
      dealCondition,
      accuracyThreshold,
      mockAIEngine
    );
    
    // 期待値の確認
    // スコア0.85は閾値0.80を超えているため、判定結果は『良好（GOOD）』
    expect(result.accuracyScore).toBe(0.85);
    expect(result.threshold).toBe(0.80);
    expect(result.judgmentResult).toBe('GOOD');
    expect(result.isTrustworthy).toBe(true);
    expect(result.canAdopt).toBe(true);
  });
});