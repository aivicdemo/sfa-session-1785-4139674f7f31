import { DataQualityScoreCalculator } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア算出', () => {
  // SCEN-479
  test('不整合検出件数が負の値のとき、ValidationErrorが発生する', () => {
    const calculator = new DataQualityScoreCalculator();
    const negativeInconsistencyCount = -5;

    expect(() => {
      calculator.calculateDataQualityScore({
        totalRecordsChecked: 100,
        inconsistencyDetectionCount: negativeInconsistencyCount,
        dataComplianceRuleCount: 5,
        appliedRuleCount: 5,
      });
    }).toThrow(/不整合検出件数は0以上の値である必要があります/);
  });
});