import { calculatePriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-954
  test('改善優先度スコア算出機能 - 影響度と発生頻度の除算で端数が発生するとき、指定の丸め規則に従って優先度スコアが算出される', () => {
    const impact = 3;
    const frequency = 7;
    const rounding_rule = 'round_to_2_decimal_places';

    const result = calculatePriorityScore({
      impact,
      frequency,
      rounding_rule,
    });

    expect(result).toBe(0.43);
    expect(typeof result).toBe('number');
  });
});