import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('改善優先度スコア算出機能', () => {
  // SCEN-933
  test('高影響度・低発生頻度の問題パターンが中程度優先度になる', () => {
    const impact = 9;
    const frequency = 2;

    const result = calculateImprovementPriorityScore({ impact, frequency });

    expect(result.score).toBeGreaterThanOrEqual(40);
    expect(result.score).toBeLessThanOrEqual(60);
    expect(result.priorityLevel).toBe('Medium');
  });
});