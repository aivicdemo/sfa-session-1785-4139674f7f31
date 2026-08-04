import { calculateImprovementPriorityRank } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善優先度ランク算出機能', () => {
  // SCEN-489
  test('改善対象項目の実装難易度が null のとき、エラーが発生する', () => {
    const improvementItem = {
      improvementEffectScore: 85,
      userSatisfactionScore: 75,
      implementationDifficulty: null,
      estimatedImplementationWeeks: 4,
    };

    expect(() => calculateImprovementPriorityRank(improvementItem)).toThrow(
      /実装難易度/
    );
  });
});