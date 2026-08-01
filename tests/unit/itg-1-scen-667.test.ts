import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('改善優先度スコア算出機能', () => {
  // SCEN-667
  test('影響度が未入力のときエラーを発生させる', () => {
    const input = {
      urgency: 8,
      impact: null,
      feasibility: 6,
    };

    expect(() => calculateImprovementPriorityScore(input)).toThrow(/影響度/);
  });
});