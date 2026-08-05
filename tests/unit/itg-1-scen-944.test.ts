import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('改善優先度スコア算出機能', () => {
  // SCEN-944
  test('問題パターン識別子が未設定のときValidationErrorを返す', () => {
    const input = {
      problemPatternId: null,
      improvementTheme: '提案資料の品質向上',
      quantitativeEffect: 15,
      implementationDifficulty: 3,
      affectedPersonCount: 5,
      impactDurationDays: 30
    };

    expect(() => calculateImprovementPriorityScore(input)).toThrow(/パターン識別子/);
  });
});