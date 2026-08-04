import { describe, test, expect } from '@jest/globals';
import { DataQualityScoreCalculator } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア算出', () => {
  test('SCEN-479: 不整合検出件数が負の値のとき、ValidationErrorが発生する', () => {
    const calculator = new DataQualityScoreCalculator();

    const invalidInput = {
      totalRecordCount: 1000,
      mismatchDetectionCount: -5,
      dataCompletionRate: 0.95,
      validationRulePassRate: 0.92,
    };

    expect(() => {
      calculator.calculateDataQualityScore(invalidInput);
    }).toThrow(/不整合検出件数は0以上の値である必要があります。入力値: -5/);
  });
});