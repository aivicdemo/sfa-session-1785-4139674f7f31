import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-660
  test('改善優先度スコア算出機能 - 影響度と発生頻度から改善優先度スコアが正常に計算される', () => {
    const impact_degree = 5;
    const occurrence_frequency = 3;
    const expected_priority_score = 15;

    const result = calculateImprovementPriorityScore(
      impact_degree,
      occurrence_frequency
    );

    expect(result).toBe(expected_priority_score);
  });
});