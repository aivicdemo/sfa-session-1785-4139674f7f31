import { calculatePriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-690
  test('改善優先度スコア算出機能 - 発生頻度が小数値のとき正確に優先度スコアが計算される', () => {
    const frequency = 2.5;
    const impact = 3;
    const difficulty = 2;

    const result = calculatePriorityScore({
      frequency,
      impact,
      difficulty,
    });

    const expectedScore = 3.75;
    expect(result.score).toBe(expectedScore);
  });
});