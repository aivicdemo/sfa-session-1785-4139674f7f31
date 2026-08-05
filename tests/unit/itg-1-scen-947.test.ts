import { describe, it, expect } from '@jest/globals';
import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('改善優先度スコア算出機能', () => {
  it('SCEN-947: 影響度が0かつ発生頻度が0のときエラーが発生する', () => {
    const input = {
      impact: 0,
      frequency: 0,
    };

    expect(() => calculateImprovementPriorityScore(input)).toThrow(/影響度と発生頻度は0より大きい値を設定してください/);
  });
});