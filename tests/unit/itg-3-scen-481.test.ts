import { calculateDataQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア算出', () => {
  // SCEN-481
  test('検証対象レコード総数が null のとき、エラーが発生する', () => {
    const input = {
      totalRecordsToValidate: null,
      passedRecords: 95,
      failedRecords: 5,
      validationRuleId: 'rule-001',
    };

    expect(() => calculateDataQualityScore(input)).toThrow(/totalRecordsToValidate/);
  });
});