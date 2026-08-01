import { describe, test, expect } from '@jest/globals';
import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-669
  test('改善優先度スコア算出機能 - 問題パターン識別子が入力されていないとき処理がエラーになる', () => {
    const inputWithEmptyPatternId = {
      problemPatternId: '',
      impactDegree: 8,
      frequency: 6,
      improvementEffect: 7,
      analysisDate: new Date('2024-01-15T11:00:00Z')
    };

    expect(() =>
      calculateImprovementPriorityScore(inputWithEmptyPatternId)
    ).toThrow(/問題パターン識別子/);
  });

  test('改善優先度スコア算出機能 - 問題パターン識別子がnullのとき処理がエラーになる', () => {
    const inputWithNullPatternId = {
      problemPatternId: null,
      impactDegree: 8,
      frequency: 6,
      improvementEffect: 7,
      analysisDate: new Date('2024-01-15T11:00:00Z')
    };

    expect(() =>
      calculateImprovementPriorityScore(inputWithNullPatternId as any)
    ).toThrow(/問題パターン識別子/);
  });
});