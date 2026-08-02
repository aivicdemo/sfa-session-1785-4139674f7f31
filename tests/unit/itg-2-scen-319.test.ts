import { calculateCorrelationBetweenDeviationAndClosingRate } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-319
  test('営業担当者0名のデータから乖離度と成約実績の相関が計算される', () => {
    const salesRepresentatives = [];
    const result = calculateCorrelationBetweenDeviationAndClosingRate(salesRepresentatives);
    
    expect(result === null || Number.isNaN(result)).toBe(true);
  });
});