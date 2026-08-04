import { calculateDataQualityScore } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム', () => {
  // SCEN-414
  test('データ品質スコア算出機能 - 検証結果が0件の場合、スコアが基準値（100）で算出される', () => {
    const validationResults: object[] = [];

    const score = calculateDataQualityScore(validationResults);

    expect(score).toBe(100);
  });
});