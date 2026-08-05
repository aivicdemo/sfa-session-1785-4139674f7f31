import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('改善優先度スコア算出機能', () => {
  // SCEN-941
  test('問題パターンが空配列のとき関数がエラーをスローする', () => {
    const emptyProblemPatterns: Array<{
      pattern_id: string;
      impact_level: number;
      frequency: number;
    }> = [];

    expect(() => {
      calculateImprovementPriorityScore(emptyProblemPatterns);
    }).toThrow(/問題パターン/);
  });
});