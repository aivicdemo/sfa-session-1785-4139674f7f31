import { describe, test, expect } from '@jest/globals';
import { calculateDataQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア算出', () => {
  test('SCEN-482: 検証実行日時が null のときエラーが発生する', () => {
    const datasetId = 'dataset-001';
    const validationItems = ['customer_name', 'email', 'phone'];
    const validationExecutedAt = null;
    const recordCount = 1000;
    const passedCount = 950;

    expect(() =>
      calculateDataQualityScore({
        datasetId,
        validationItems,
        validationExecutedAt,
        recordCount,
        passedCount,
      })
    ).toThrow(/INVALID_VALIDATION_TIMESTAMP|検証実行日時|timestamp/);
  });
});