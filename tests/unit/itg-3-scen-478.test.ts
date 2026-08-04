import { calculateDataQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア算出', () => {
  // SCEN-478
  test('検証対象レコード総数が0のとき、エラーが発生する', () => {
    const invalidInput = {
      totalRecordsValidated: 0,
      recordsPassedValidation: 50,
      dataQualityRules: 10,
    };

    expect(() => calculateDataQualityScore(invalidInput)).toThrow(/検証対象レコード総数/);
  });
});