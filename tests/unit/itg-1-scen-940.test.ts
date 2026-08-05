import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-940
  test('改善優先度スコア算出機能 - 発生頻度が null のとき処理がエラーになる', () => {
    const input = {
      impact: 85,
      frequency: null,
      difficulty: 3,
    };

    expect(() => calculateImprovementPriorityScore(input)).toThrow(/frequency is required|発生頻度/);
  });
});