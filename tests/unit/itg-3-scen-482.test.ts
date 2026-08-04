import { calculateDataQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア算出', () => {
  test('SCEN-482: 検証実行日時が null のとき、エラーが発生する', () => {
    const datasetId = 'DS-2024-001';
    const validationItems = [
      { itemName: '顧客名', completeness: 95 },
      { itemName: '業種', completeness: 88 },
    ];
    const validationExecutedAt = null;
    const totalValidationCount = 150;

    expect(() =>
      calculateDataQualityScore({
        datasetId,
        validationItems,
        validationExecutedAt,
        totalValidationCount,
      })
    ).toThrow(/INVALID_VALIDATION_TIMESTAMP|タイムスタンプ/);
  });
});