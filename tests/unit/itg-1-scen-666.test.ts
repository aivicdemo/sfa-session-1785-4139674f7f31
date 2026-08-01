import { calculatePriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-666
  test('改善優先度スコア算出機能 - 影響度と発生頻度の両方が0のとき優先度スコアは0になる', () => {
    const impact = 0;
    const frequency = 0;
    
    const result = calculatePriorityScore(impact, frequency);
    
    expect(result).toBe(0);
  });
});