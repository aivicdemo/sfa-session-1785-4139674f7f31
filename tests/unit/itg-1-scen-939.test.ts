import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('改善優先度スコア算出機能', () => {
  // SCEN-939
  test('影響度が null のとき処理がエラーになる', () => {
    const input = {
      impact: null,
      urgency: 8,
      executionCost: 5,
      effectDuration: 6,
    };

    expect(() => calculateImprovementPriorityScore(input)).toThrow(/影響度/);
  });
});