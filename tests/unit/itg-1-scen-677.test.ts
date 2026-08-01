import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-677
  test('改善優先度スコア算出機能 - 影響度と発生頻度のスコア計算方式が指定されているとき指定方式で計算される', () => {
    const impact_score = 5;
    const frequency_score = 3;
    const impact_calculation_method = 'weighted_average';
    const frequency_calculation_method = 'exponential';

    const result = calculateImprovementPriorityScore({
      impact_score,
      frequency_score,
      impact_calculation_method,
      frequency_calculation_method,
    });

    const expected_weighted_impact = (5 * 0.6) + (5 * 0.4);
    const expected_exponential_frequency = Math.exp(3 / 10);
    const expected_priority_score = (expected_weighted_impact * 0.5) + (expected_exponential_frequency * 0.5);

    expect(result.priority_score).toBeCloseTo(expected_priority_score, 5);
    expect(result.calculation_method).toBe('weighted_average_exponential');
    expect(typeof result.priority_score).toBe('number');
    expect(result.priority_score).toBeGreaterThanOrEqual(0);
    expect(result.priority_score).toBeLessThanOrEqual(100);
  });
});