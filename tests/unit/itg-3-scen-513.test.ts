import { describe, test, expect, beforeEach } from '@jest/globals';
import { validateDataQualityAndPriority } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコアと改善優先度ランクの整合性検証', () => {
  // SCEN-513
  test('スコアが0に近いのに改善優先度がランク3（最低優先度）のとき、エラーが発生する', () => {
    const dataQualityScore = 0.05;
    const improvementPriorityRank = 3;

    expect(() => {
      validateDataQualityAndPriority({
        dataQualityScore,
        improvementPriorityRank
      });
    }).toThrow(expect.objectContaining({
      name: 'ValidationError',
      code: 'DQ_PRIORITY_MISMATCH',
      message: expect.stringMatching(/データ品質スコア.*改善優先度/)
    }));
  });
});