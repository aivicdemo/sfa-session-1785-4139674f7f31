import { calculatePriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-689
  test('[normal] 改善優先度スコア算出機能 - 影響度が小数値のとき正確に優先度スコアが計算される', () => {
    const impact = 2.5;
    const urgency = 3;
    const feasibility = 0.8;

    const result = calculatePriorityScore({
      impact,
      urgency,
      feasibility,
    });

    expect(result).toBe(6.0);
  });
});