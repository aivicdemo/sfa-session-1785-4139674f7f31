import { calculateDataQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア算出', () => {
  // SCEN-480
  test('不整合検出件数が null のとき、エラーが発生する', () => {
    const input = {
      totalRecords: 1000,
      inconsistencyCount: null,
      duplicateCount: 5,
      formatErrorCount: 3,
      validationErrorCount: 2
    };

    expect(() => calculateDataQualityScore(input)).toThrow(/不整合検出件数/);
  });
});