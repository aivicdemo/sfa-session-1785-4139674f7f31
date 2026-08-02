import { calculateConfidenceScore } from '../../src/logic/it-1-br-2-2-1-1';

describe('顧客データ統合判定機能 - 信頼度スコア計算', () => {
  // SCEN-886
  test('統合判定の信頼度スコア計算で端数が発生するとき、指定の丸め処理が適用される', () => {
    const attributeMatchDegrees = [0.95, 0.88, 0.82];
    const roundingDecimalPlaces = 2;
    
    const result = calculateConfidenceScore({
      attributeMatchDegrees,
      roundingDecimalPlaces,
    });

    expect(result).toBe(87.46);
  });
});