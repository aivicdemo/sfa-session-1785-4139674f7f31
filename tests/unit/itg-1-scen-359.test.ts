import { determineSystemHealthStatus } from '../../src/logic/it-1-br-2-1-1';

describe('システムヘルスチェック合格判定機能', () => {
  // SCEN-359
  test('営業データ品質スコアが合格基準値を超える場合に合格と判定される', () => {
    const salesDataQualityScore = 71;
    const passingThreshold = 70;

    const result = determineSystemHealthStatus({
      salesDataQualityScore,
      passingThreshold,
    });

    expect(result.isPassed).toBe(true);
    expect(result.status).toBe('合格');
    expect(result.scoreDetails.salesDataQualityScore).toBe(71);
  });
});