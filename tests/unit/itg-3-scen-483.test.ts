import { calculateDataQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム', () => {
  // SCEN-483
  test('データ品質スコア算出機能 - 検証実行日時が不正な日付形式のとき、エラーが発生する', () => {
    const invalid_date_formats = [
      '2024-13-45',
      '2024/12/32',
      'invalid-date',
      '2024年12月25日',
      '2024-12-32 25:61:61',
      '2024-13-01 12:00:00',
      '2024-02-30 00:00:00',
      'abc',
      '',
      null,
      undefined,
    ];

    invalid_date_formats.forEach((invalid_verification_datetime) => {
      expect(() =>
        calculateDataQualityScore({
          verification_datetime: invalid_verification_datetime as any,
          validation_rule_id: 'rule_001',
          data_quality_results: [
            {
              data_point_id: 'dp_001',
              validation_result: 'PASS',
            },
          ],
        })
      ).toThrow(/INVALID_DATE_FORMAT/);
    });
  });
});