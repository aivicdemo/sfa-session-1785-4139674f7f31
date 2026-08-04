import { describe, test, expect } from '@jest/globals';
import { calculateImprovementPriorityRank } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善優先度ランク算出機能', () => {
  test('SCEN-489: 改善対象項目の実装難易度が null のとき、エラーが発生する', () => {
    const improvementItem = {
      improvementId: 'IMP-001',
      improvementEffectScore: 85,
      userSatisfactionScore: 90,
      implementationDifficulty: null,
      implementationCost: 50000,
      estimatedTimeWeeks: 4,
    };

    expect(() => calculateImprovementPriorityRank(improvementItem)).toThrow(/実装難易度/);
  });
});