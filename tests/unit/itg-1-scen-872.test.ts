import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-872
  test('改善優先度判定機能 - 複数指標の乖離度を統合して改善優先度が判定される', () => {
    // Arrange: モックデータと目標値の準備
    const currentMetrics = {
      salesAchievementRate: 65, // 売上達成率: 65%
      customerSatisfactionScore: 72, // 顧客満足度スコア: 72点（100点満点）
      salesProcessEfficiencyIndex: 58, // 営業プロセス効率指数: 58（100が最大）
    };

    const targetMetrics = {
      salesAchievementRate: 90, // 目標: 売上達成率 90%
      customerSatisfactionScore: 85, // 目標: 顧客満足度スコア 85点
      salesProcessEfficiencyIndex: 75, // 目標: 営業プロセス効率指数 75
    };

    // Act: 改善優先度判定関数を実行
    const result = calculateImprovementPriorityScore(currentMetrics, targetMetrics);

    // Assert: 結果の検証

    // 統合優先度スコアが68点以上75点以下の範囲内であることを確認
    expect(result.priorityScore).toBeGreaterThanOrEqual(68);
    expect(result.priorityScore).toBeLessThanOrEqual(75);

    // 改善対象指標の優先順位を確認
    // 乖離度の計算:
    // 売上達成率: (90 - 65) / 90 * 100 = 27.78% → 乖離度スコア 27.78
    // 営業プロセス効率指数: (75 - 58) / 75 * 100 = 22.67 → 乖離度スコア 22.67
    // 顧客満足度スコア: (85 - 72) / 85 * 100 = 15.29 → 乖離度スコア 15.29
    expect(result.improvementTargets).toHaveLength(3);

    // 1位: 売上達成率（乖離度が最大）
    expect(result.improvementTargets[0].metric).toBe('salesAchievementRate');
    expect(result.improvementTargets[0].deviationDegree).toBeCloseTo(27.78, 1);
    expect(result.improvementTargets[0].priority).toBe(1);

    // 2位: 営業プロセス効率指数
    expect(result.improvementTargets[1].metric).toBe('salesProcessEfficiencyIndex');
    expect(result.improvementTargets[1].deviationDegree).toBeCloseTo(22.67, 1);
    expect(result.improvementTargets[1].priority).toBe(2);

    // 3位: 顧客満足度スコア（乖離度が最小）
    expect(result.improvementTargets[2].metric).toBe('customerSatisfactionScore');
    expect(result.improvementTargets[2].deviationDegree).toBeCloseTo(15.29, 1);
    expect(result.improvementTargets[2].priority).toBe(3);
  });
});