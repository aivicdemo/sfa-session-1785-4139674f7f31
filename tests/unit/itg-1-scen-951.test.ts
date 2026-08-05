import { calculateImprovedPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-951
  test('改善優先度スコア算出機能 - 影響度と発生頻度の積がちょうど優先度スコア上限値に達したとき、上限値として記録される', () => {
    const impact_degree = 10;
    const occurrence_frequency = 10;
    const priority_score_upper_limit = 100;

    const calculated_score = calculateImprovedPriorityScore({
      impact_degree,
      occurrence_frequency,
    });

    expect(calculated_score).toBe(priority_score_upper_limit);
    expect(calculated_score).toBeLessThanOrEqual(priority_score_upper_limit);
  });
});