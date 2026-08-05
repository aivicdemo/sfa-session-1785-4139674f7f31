import { describe, test, expect } from '@jest/globals';
import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-948
  test('改善優先度スコア算出機能 - 影響度が100を超える数値のときエラーになる', () => {
    const input = {
      impact: 101,
      frequency: 50,
    };

    expect(() => calculateImprovementPriorityScore(input)).toThrow(/ERR_IMPACT_OUT_OF_RANGE/);
    expect(() => calculateImprovementPriorityScore(input)).toThrow(/影響度は 0～100 の範囲で指定してください/);
  });
});