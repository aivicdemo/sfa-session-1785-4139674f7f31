import { describe, test, expect } from '@jest/globals';
import { calculateImprovementPriorityScore } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-683
  test('改善優先度スコア算出機能 - 問題パターンの影響度が最大値直上のとき処理がエラーになる', () => {
    const problemPatternId = 'PATTERN_001';
    const impactDegree = 100.0001;
    const occurrenceFrequency = 0.5;
    const improvementEffect = 0.8;
    const implementationDifficulty = 0.3;

    expect(() =>
      calculateImprovementPriorityScore({
        problemPatternId,
        impactDegree,
        occurrenceFrequency,
        improvementEffect,
        implementationDifficulty,
      })
    ).toThrow(/影響度が許容範囲を超過しています/);

    try {
      calculateImprovementPriorityScore({
        problemPatternId,
        impactDegree,
        occurrenceFrequency,
        improvementEffect,
        implementationDifficulty,
      });
    } catch (error: unknown) {
      const err = error as {
        name?: string;
        message?: string;
        code?: string;
      };
      expect(err.name).toBe('ValidationError');
      expect(err.message).toContain('影響度が許容範囲を超過しています');
      expect(err.code).toBe('ERR_IMPACT_EXCEEDS_MAX');
    }
  });
});