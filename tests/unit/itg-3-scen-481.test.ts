import { calculateDataQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア算出', () => {
  // SCEN-481
  test('検証対象レコード総数が null のとき、エラーが発生する', () => {
    const invalidInput = {
      totalRecordsToValidate: null,
      passedValidationCount: 95,
      failedValidationCount: 5,
    };

    expect(() => calculateDataQualityScore(invalidInput)).toThrow(/totalRecordsToValidate/);
  });
});