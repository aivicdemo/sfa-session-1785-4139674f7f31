import { calculateDataQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア算出', () => {
  test('SCEN-483: 検証実行日時が不正な日付形式のとき、エラーが発生する', () => {
    const invalidDateFormats = [
      '2024-13-45',
      '2024/12/32',
      'invalid-date',
      '2024年12月25日',
    ];

    invalidDateFormats.forEach((invalidDate) => {
      expect(() =>
        calculateDataQualityScore({
          verificationExecutedAt: invalidDate,
          totalRecordCount: 1000,
          validRecordCount: 950,
          duplicateRecordCount: 20,
          missingFieldCount: 30,
        })
      ).toThrow(/INVALID_DATE_FORMAT/);
    });
  });
});