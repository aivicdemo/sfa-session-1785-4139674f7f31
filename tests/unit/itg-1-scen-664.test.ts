import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-664
  test('改善優先度スコア算出機能 - 影響度が0のとき優先度スコアは0になる', () => {
    const input = {
      impact: 0,
      urgency: 80,
      detectionFrequency: 5,
      affectedCount: 3,
    };

    const result = calculateImprovementPriorityScore(input);

    expect(result).toBe(0);
  });
});