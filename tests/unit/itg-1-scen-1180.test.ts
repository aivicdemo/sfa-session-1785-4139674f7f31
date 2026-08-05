import { describe, it, expect, beforeEach } from '@jest/globals';
import { calculateProcessDeviationImpactOnConversionRate } from '../../src/logic/it-1-br-2-1-1';

describe('標準プロセス乖離による影響可視化機能', () => {
  // SCEN-1180
  it('標準プロセスからの乖離が成約率に与える正の影響が数値化され、可視化される', () => {
    // テストデータ: 標準プロセス乖離度が異なる3つの営業案件
    const low_deviation_deal = {
      deal_id: 'DEAL_001',
      process_deviation_rate: 10,
      actual_conversion_rate: 45.2,
    };

    const mid_deviation_deal = {
      deal_id: 'DEAL_002',
      process_deviation_rate: 50,
      actual_conversion_rate: 57.8,
    };

    const high_deviation_deal = {
      deal_id: 'DEAL_003',
      process_deviation_rate: 90,
      actual_conversion_rate: 64.5,
    };

    // 標準プロセス遵守時の基準成約率（参考値）: 40%
    const baseline_conversion_rate = 40;

    // 各案件について成約率への影響度を計算
    const low_impact = calculateProcessDeviationImpactOnConversionRate({
      process_deviation_rate: low_deviation_deal.process_deviation_rate,
      actual_conversion_rate: low_deviation_deal.actual_conversion_rate,
      baseline_conversion_rate: baseline_conversion_rate,
    });

    const mid_impact = calculateProcessDeviationImpactOnConversionRate({
      process_deviation_rate: mid_deviation_deal.process_deviation_rate,
      actual_conversion_rate: mid_deviation_deal.actual_conversion_rate,
      baseline_conversion_rate: baseline_conversion_rate,
    });

    const high_impact = calculateProcessDeviationImpactOnConversionRate({
      process_deviation_rate: high_deviation_deal.process_deviation_rate,
      actual_conversion_rate: high_deviation_deal.actual_conversion_rate,
      baseline_conversion_rate: baseline_conversion_rate,
    });

    // 乖離度50%の案件について、影響値が数値化されていることを確認
    expect(typeof mid_impact.impact_percentage).toBe('number');
    expect(mid_impact.impact_percentage).toBe(17.8);

    // 影響値がプラス方向であることを確認
    expect(mid_impact.impact_percentage).toBeGreaterThan(0);

    // 乖離度10%と90%の案件の影響値を比較
    expect(low_impact.impact_percentage).toBe(5.2);
    expect(high_impact.impact_percentage).toBe(24.5);

    // 乖離度が高いほど正の影響値が大きくなることを確認
    expect(high_impact.impact_percentage).toBeGreaterThan(mid_impact.impact_percentage);
    expect(mid_impact.impact_percentage).toBeGreaterThan(low_impact.impact_percentage);

    // 可視化用データ構造が返却されることを確認
    expect(mid_impact).toHaveProperty('visualization_bar_length');
    expect(mid_impact).toHaveProperty('visualization_gauge_direction');

    // 乖離度50%の案件: プラス方向バーが表示される
    expect(mid_impact.visualization_bar_length).toBeGreaterThan(0);
    expect(mid_impact.visualization_gauge_direction).toBe('positive');

    // 乖離度90%の案件: より大きなプラス方向ゲージが表示される
    expect(high_impact.visualization_bar_length).toBeGreaterThan(
      mid_impact.visualization_bar_length
    );
    expect(high_impact.visualization_gauge_direction).toBe('positive');

    // 乖離度10%の案件: より小さなプラス方向ゲージが表示される
    expect(low_impact.visualization_bar_length).toBeLessThan(
      mid_impact.visualization_bar_length
    );
    expect(low_impact.visualization_gauge_direction).toBe('positive');
  });
});