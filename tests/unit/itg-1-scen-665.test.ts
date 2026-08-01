import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-665
  test('改善優先度スコア算出機能 - 発生頻度が0のとき優先度スコアは0になる', () => {
    const improvement_item = {
      impact_degree: 85,
      occurrence_frequency: 0,
      resolution_difficulty: 6,
    };

    const result = calculateImprovementPriorityScore(improvement_item);

    expect(result).toBe(0);
  });
});