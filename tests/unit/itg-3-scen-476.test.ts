import { calculateDataQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - データ品質スコア算出', () => {
  // SCEN-476
  test('検証結果レポートが空配列のとき、エラーがスローされること', () => {
    const emptyValidationResults: any[] = [];

    expect(() => calculateDataQualityScore(emptyValidationResults)).toThrow(/検証結果/);
  });
});