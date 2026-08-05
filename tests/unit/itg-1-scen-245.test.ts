import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  test('SCEN-245: 改善指導優先順位決定機能 - 計算結果が NaN になるときエラーになる', () => {
    const input_deviation_rate = null;
    const input_occurrence_frequency = undefined;
    const input_business_impact = 0;

    expect(() => {
      calculateImprovementPriorityScore({
        deviation_rate: input_deviation_rate,
        occurrence_frequency: input_occurrence_frequency,
        business_impact: input_business_impact,
      });
    }).toThrow(/計算エラー：優先順位スコアが無効です/);
  });
});