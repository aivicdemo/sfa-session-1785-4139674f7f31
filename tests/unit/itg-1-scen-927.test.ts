import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('改善優先度スコア算出機能', () => {
  // SCEN-927: [normal] 改善優先度スコア算出機能 - 影響度と発生頻度から改善優先度スコアが正しく算出される
  test('影響度と発生頻度の積により改善優先度スコアが1～25の範囲で正しく算出される', () => {
    const impact_level_5_frequency_5 = calculateImprovementPriorityScore(5, 5);
    expect(impact_level_5_frequency_5).toBe(25);

    const impact_level_3_frequency_2 = calculateImprovementPriorityScore(3, 2);
    expect(impact_level_3_frequency_2).toBe(6);

    const impact_level_1_frequency_1 = calculateImprovementPriorityScore(1, 1);
    expect(impact_level_1_frequency_1).toBe(1);

    const impact_level_5_frequency_1 = calculateImprovementPriorityScore(5, 1);
    expect(impact_level_5_frequency_1).toBe(5);

    const impact_level_1_frequency_5 = calculateImprovementPriorityScore(1, 5);
    expect(impact_level_1_frequency_5).toBe(5);
  });
});