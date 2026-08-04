import { calculateDataQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア算出', () => {
  test('SCEN-478: 検証対象レコード総数が0のとき、エラーが発生する', () => {
    const invalidInput = {
      totalRecordsChecked: 0,
      passedRecords: 0,
      failedRecords: 0,
    };

    expect(() => calculateDataQualityScore(invalidInput)).toThrow(/検証対象レコード総数/);
  });
});